import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  Alert,
  ScrollView,
  Button,
} from "react-native";
import colors from "./Colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
// import tempData from "./tempData";
// import tempPeople from "./tempPeople";
import TicketList from "./TicketList";
import PeopleList from "./PeopleList";
import AddTicketModal from "./AddTicketModal";
import Task from "../components/Task";

import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";

import {
  getProperty,
  getTenant,
  getTask,
  getSubtask,
  getInvitation,
  getLandlord,
  getChatRoom,
  getUser,
} from "../src/graphql/queries";
import {
  createTask,
  createTenant,
  createInvitation,
  deleteSubtask,
  updateInvitation,
  updateProperty,
  updateTask,
  updateLandlord,
  updateTenant,
  deleteProperty,
  deleteTask,
  deleteInvitation,
  deleteChatRoom,
  updateChatRoom,
  updateUser,
  deleteMessage,
} from "../src/graphql/mutations";
import TenantForm from "./TenantForm";
import { NavigationActions } from "react-navigation";
import { RotationGestureHandler } from "react-native-gesture-handler";
import { onUpdateProperty, onUpdateTask, onUpdateTenant } from "../src/graphql/subscriptions";
{
  /* https://www.youtube.com/watch?v=ce-ancZvtKE&list=PLqtWgQ5BRLPvbmeIYf769yb25g4W8NUZo&index=3 */
}

export default function rentalPage({ navigation }) {
  const [state, setState] = useState({
    addTicketVisible: false,
    lists: [],
    people: [],
  });

  const [landlord, setLandlord] = useState({});
  const [tenantModal, setTenantModal] = useState(false);
  const [currentTenant, setCurrentTenant] = useState();
  const [editTenantModal, setEditTenantModal] = useState(false);
  const [modalLandlordMenuOpen, setmodalLandlordMenuOpen] = useState(false);
  const [modalTenantMenuOpen, setmodalTenantMenuOpen] = useState(false);
  const [landlordBool, setLandlordBool] = useState(false);
  const [property, setProperty] = useState(navigation.getParam("property"));
  const [invitationModal, setInvitationModal] = useState(false);
  const [invitations, setInvitations] = useState([]);

  const generateID = () => {
    return Math.random().toString();
  };

  const leaveProperty = () => {
    Alert.alert(
      "Leave Property",
      "You are about to leave " + property.address,
      [
        {
          text: "Cancel",
          onPress: () => Alert.alert("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Leave",
          // here is where you should put the delete method
          onPress: async () => {
            console.log("Delete Pressed");
            try {

              const chatRoomData = await API.graphql(graphqlOperation(getChatRoom,{id:property.chatRoomID}));
              chatRoomData.data.getChatRoom.chatRoomUsers.splice(chatRoomData.data.getChatRoom.chatRoomUsers.indexOf(navigation.getParam("user").email,1));
              delete chatRoomData.data.getChatRoom.createdAt;
              delete chatRoomData.data.getChatRoom.updatedAt;
              await API.graphql(graphqlOperation(updateChatRoom,{input:chatRoomData.data.getChatRoom}));


              // get list of tenant ids
              const tenantList = [];

              // loop through current tenants
              for (const tenantID of property.tenants) {
                // if tenant is not leaving, add to list
                if (tenantID != navigation.getParam("user").email) {
                  tenantList.push(tenantID);
                }
              }

              // update property
              property.tenants = tenantList;

              // update database
              await API.graphql(
                graphqlOperation(updateProperty, { input: property })
              );

              navigation.goBack();

              const tenantData = await API.graphql({
                query: getTenant,
                variables: { id: navigation.getParam("user").email },
              });

              tenantData.data.getTenant.invitations.splice(
                tenantData.data.getTenant.invitations.indexOf(
                  tenantData.data.getTenant.accepted
                ),
                1
              );

              

              await API.graphql(
                graphqlOperation(deleteInvitation, {
                  input: { id: tenantData.data.getTenant.accepted },
                })
              );

              tenantData.data.getTenant.accepted = null;

              delete tenantData.data.getTenant.createdAt;
              delete tenantData.data.getTenant.updatedAt;

              await API.graphql(
                graphqlOperation(updateTenant, {
                  input: tenantData.data.getTenant,
                })
              );

              const userData = await API.graphql({
                query: getUser,
                variables: { id: navigation.getParam("user").email },
              });
              userData.data.getUser.chatRooms.splice(userData.data.getUser.chatRooms.indexOf(property.chatRoomID));
              delete userData.data.getUser.createdAt;
              delete userData.data.getUser.updatedAt;
              await API.graphql(graphqlOperation(updateUser,{input:userData.data.getUser}));

            } catch (error) {
              console.log("error leaving property", error);
            }
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog."
          ),
      }
    );
  };
  const removeProperty = () => {
    Alert.alert(
      "Delete Property",
      "You are about to delete " + property.address,
      [
        {
          text: "Cancel",
          onPress: () => Alert.alert("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Delete",
          // here is where you should put the delete method
          onPress: async () => {
            console.log("Delete Pressed");
            try {

              const chatRoomData = await API.graphql(graphqlOperation(getChatRoom,{id:property.chatRoomID}));
              delete chatRoomData.data.getChatRoom.createdAt;
              delete chatRoomData.data.getChatRoom.updatedAt;
              for (const messageID of chatRoomData.data.getChatRoom.messages) {
                await API.graphql(graphqlOperation(deleteMessage,{input:{id:messageID}}));
              }

              await API.graphql(graphqlOperation(deleteChatRoom,{input:{id:property.chatRoomID}}));

              for (const task of state.lists) {
                const subtasks = [];
                console.log(task);
                for (const subtask of task.subtasks) {
                  subtasks.push(subtask.id);
                  await API.graphql(
                    graphqlOperation(deleteSubtask, {
                      input: { id: subtask.id },
                    })
                  );
                }
                task.subtasks = subtasks;
                await API.graphql(
                  graphqlOperation(deleteTask, { input: { id: task.id } })
                );
              }

              for (const tenant of state.people) {
                console.log(tenant);
                tenant.invitations.splice(
                  tenant.invitations.indexOf(tenant.accepted),
                  1
                );

                const invitationData = await API.graphql({
                  query: getInvitation,
                  variables: { id: tenant.accepted },
                });
                await API.graphql(
                  graphqlOperation(deleteInvitation, {
                    input: { id: invitationData.data.getInvitation.id },
                  })
                );
                tenant.accepted = null;
                delete tenant.rentAmount;
                delete tenant.leaseStart;
                delete tenant.leaseTerm;
                await API.graphql(
                  graphqlOperation(updateTenant, { input: tenant })
                );

                const userData = await API.graphql(graphqlOperation(getUser, {id:tenant.id}));
                delete userData.data.getUser.createdAt;
                delete userData.data.getUser.updatedAt;
                userData.data.getUser.chatRooms.splice(userData.data.getUser.chatRooms.indexOf(property.chatRoomID),1);
                await API.graphql(graphqlOperation(updateUser,{input:userData.data.getUser}));

              }

              for (const invitation of property.invitations) {
                const invitationData = await API.graphql({
                  query: getInvitation,
                  variables: { id: invitation },
                });

                if (invitationData.data.getInvitation == null) continue;
                const tenantData = await API.graphql({
                  query: getTenant,
                  variables: { id: invitationData.data.getInvitation.tenant },
                });

                tenantData.data.getTenant.invitations.splice(
                  tenantData.data.getTenant.invitations.indexOf(invitation),
                  1
                );

                delete tenantData.data.getTenant.createdAt;
                delete tenantData.data.getTenant.updatedAt;

                delete tenantData.data.getTenant.rentAmount;
                delete tenantData.data.getTenant.leaseStart;
                delete tenantData.data.getTenant.leaseTerm;

                await API.graphql(
                  graphqlOperation(updateTenant, {
                    input: tenantData.data.getTenant,
                  })
                );

                await API.graphql(
                  graphqlOperation(deleteInvitation, {
                    input: { id: invitationData.data.getInvitation.id },
                  })
                );
              }

              await API.graphql(
                graphqlOperation(deleteProperty, {
                  input: { id: property.id },
                })
              );

              landlord.properties.splice(
                landlord.properties.indexOf(property.id),
                1
              );

              await API.graphql(
                graphqlOperation(updateLandlord, {
                  input: landlord,
                })
              );

              const userData = await API.graphql(graphqlOperation(getUser, {id:navigation.getParam("user").email}));
              delete userData.data.getUser.createdAt;
              delete userData.data.getUser.updatedAt;
              userData.data.getUser.chatRooms.splice(userData.data.getUser.chatRooms.indexOf(property.chatRoomID),1);
              await API.graphql(graphqlOperation(updateUser,{input:userData.data.getUser}));

              navigation.goBack();
            } catch (error) {
              console.log("error removing property", error);
            }
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog."
          ),
      }
    );
  };
  //open modal with the tenant details
  const pressTenant = (item) => {
    //navigation.navigate("TenantForm", item);
    setCurrentTenant(item);
    setEditTenantModal(true);
  };

  const chat = () => {
    console.log("open up chat page");
    navigation.navigate("Chat");
  };
  const openAddTenant = () => {
    console.log("create tenant");
    setEditTenantModal(true);
  };
  const editTenant = async (tenant) => {
    console.log("edit tenant");
    setEditTenantModal(false);
    try {
      // create inviation
      const invitation = {
        id: generateID(),
        propertyID: property.id,
        leaseTerm: tenant.leaseTerm,
        leaseStart: tenant.leaseStart,
        rentAmount: tenant.rentAmount,
        tenant: tenant.email,
        rejected: false,
      };

      invitations.push(invitation);

      //console.log(invitation);
      // create new invitation
      await API.graphql(
        graphqlOperation(createInvitation, { input: invitation })
      );

      // adding new tenant to property, check if tenant exists
      const tenantData = await API.graphql({
        query: getTenant,
        variables: { id: tenant.email },
      });

      // create new tenant object in database if not,
      if (tenantData.data.getTenant == null) {
        const newTenant = { id: tenant.email, name: "", invitations: [] };
        await API.graphql(graphqlOperation(createTenant, { input: newTenant }));
        tenantData.data.getTenant = newTenant;
      }

      // send the invitation to tenant
      tenantData.data.getTenant.invitations.push(invitation.id);
      delete tenantData.data.getTenant.updatedAt;
      delete tenantData.data.getTenant.createdAt;

      // update tenant
      await API.graphql(
        graphqlOperation(updateTenant, { input: tenantData.data.getTenant })
      );

      property.invitations.push(invitation.id);
      console.log(property);
      await API.graphql(graphqlOperation(updateProperty, { input: property }));
    } catch (error) {
      console.log("error editing tenant", error);
    }
    //need to place a :new tenant at end if that was what was edited
  };

  const address = navigation.getParam("property").address;
  const loadData = async (data) => {
      console.log(navigation.getParam("user").email);
      // empty lists
      state.lists = [];
      state.people = [];

      setProperty(data);
      console.log(data);
      try {
        const landlordData = await API.graphql({
          query: getLandlord,
          variables: { id: data.landlord },
        });

        delete landlordData.data.getLandlord.createdAt;
        delete landlordData.data.getLandlord.updatedAt;

        setLandlord(landlordData.data.getLandlord);

        // get user details
        if (navigation.getParam("user")["custom:landlord"] == "true")
          setLandlordBool(true);

        // empty task list
        const taskList = [];

        // loop through all tasks belonging to current property
        for (const id of data.tasks) {
          // get task data
          const taskData = await API.graphql({
            query: getTask,
            variables: { id: id },
          });

          // initialize new list to store subtasks
          const curTask = taskData.data.getTask;

          if (curTask == null) continue;

          delete curTask.createdAt;
          delete curTask.updatedAt;
          curTask.subtaskList = [];

          // loop through the ids of the subtasks
          for (const subtask of curTask.subtasks) {
            // retrieve subtask data from the id
            const subtaskData = await API.graphql({
              query: getSubtask,
              variables: { id: subtask },
            });
            if (subtaskData.data.getSubtask == null) continue;
            delete subtaskData.data.getSubtask.createdAt;
            delete subtaskData.data.getSubtask.updatedAt;
            // add the data to the subtask array
            //console.log(subtaskData);
            curTask.subtaskList.push(subtaskData.data.getSubtask);
          }

          // update subtasks
          // console.log("before", curTask);
          curTask.subtasks = curTask.subtaskList;
          delete curTask.subtaskList;

          // push task into array
          taskList.push(curTask);
          // setTaskList((currentTasks)=>{
          //   return [taskData.data.getTask, ...currentTasks];
          // });
        }

        // empty tenant list
        const tenantList = [];

        // loop through ids of the tenants
        for (const id of data.tenants) {
          // get tenant data from tenant id
          const tenantData = await API.graphql({
            query: getTenant,
            variables: { id: id },
          });

          delete tenantData.data.getTenant.createdAt;
          delete tenantData.data.getTenant.updatedAt;

          const invitation = tenantData.data.getTenant.accepted;
          if (invitation == null) continue;

          const invitationData = await API.graphql({
            query: getInvitation,
            variables: { id: invitation },
          });

          console.log(invitationData);

          //remove later
          //tenantData.data.getTenant.subtasks = [];

          tenantData.data.getTenant.rentAmount =
            invitationData.data.getInvitation.rentAmount;
          tenantData.data.getTenant.leaseStart =
            invitationData.data.getInvitation.leaseStart;
          tenantData.data.getTenant.leaseTerm =
            invitationData.data.getInvitation.leaseTerm;
          // add tenant data to tenant list
          tenantList.push(tenantData.data.getTenant);
          // setTenantList((currentTenants)=>{
          //   return [tenantData.data.getTenant, ...currentTenants];
          // });
        }

        const invitationList = [];
        for (const invitation of data.invitations) {
          const invitationData = await API.graphql({
            query: getInvitation,
            variables: { id: invitation },
          });

          // delete invitationData.data.getInvitation.createdAt;
          // delete invitationData.data.getInvitation.updatedAt;
          // invitations.push(invitationData.data.getInvitation);
          // setInvitations((currentInvitations)=>{
          //   return [invitationData.data.getInvitation, ...currentInvitations];
          // });
          invitationList.push(invitationData.data.getInvitation);
        }
        setInvitations(invitationList);
        console.log("invitations",invitationList);
        // update state
        setState({
          addTicketVisible: state.addTicketVisible,
          lists: taskList,
          people: tenantList,
        });

        
      } catch (error) {
        console.log("error retrieving property data", error);
      }
  };
  // load data once when the page starts
  useEffect(() => {
    loadData(navigation.getParam("property"));
  }, [])
  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateProperty)
    ).subscribe({
      next: async (data) => {
        const newProperty = data.value.data.onUpdateProperty;

        if (newProperty.id !== property.id) {
          console.log("Message is in another room!")
          return;
        }
        loadData(newProperty);
        // setMessages([newMessage, ...messages]);
      }
    });

    return () => subscription.unsubscribe();
  }, [])

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateTenant)
    ).subscribe({
      next: (data) => {
        const newTenant= data.value.data.onUpdateTenant;

        if (newTenant.id !== navigation.getParam("user").id) {
          console.log("Message is in another room!")
          return;
        }
        navigation.goBack();
        // setMessages([newMessage, ...messages]);
      }
    });

    return () => subscription.unsubscribe();
  }, [])

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateTask)
    ).subscribe({
      next: (data) => {
        const newTask = data.value.data.onUpdateTask;
        console.log(property);
        if (!property.tasks || property.tasks.indexOf(newTask.id) == -1) {
          console.log("Message is in another room!")
          return;
        }
        loadData(property);
        // setMessages([newMessage, ...messages]);
      }
    });

    return () => subscription.unsubscribe();
  }, [])

  const toggleAddTicketModal = () => {
    setState({
      addTicketVisible: !state.addTicketVisible,
      lists: state.lists,
      people: state.people,
    });
  };

  const renderList = (list) => {
    return (
      <TicketList list={list} updateList={updateList} deleteList={deleteList} />
    );
  };

  const addList = async (list) => {
    // generate id for new list
    list.id = generateID();

    // if (!addType) {
    // initialize list of subtasks
    list.subtasks = [];

    try {
      // create the new task in the database
      await API.graphql(graphqlOperation(createTask, { input: list }));

      // add this task to the propertys list of tasks
      property.tasks.push(list.id);

      // update this property in the database
      await API.graphql(
        graphqlOperation(updateProperty, {
          input: property,
        })
      );

      // push the new task into the states task list too
      //state.lists.push(list);
      setState({
        lists: [...state.lists, list],
        addTicketVisible: false,
        people: state.people,
      });
    } catch (error) {
      console.log("error adding list", error);
    }

    console.log(state);
  };

  const updateList = async (list) => {
    // empty the list
    const taskList = [];

    // get a list of the ids of the subtasks
    for (let i = 0; i < list.subtasks.length; i++) {
      taskList.push(list.subtasks[i].id);
    }
    try {
      // get the previous task data of current task
      const taskData = await API.graphql({
        query: getTask,
        variables: { id: list.id },
      });

      // update subtasks
      taskData.data.getTask.subtasks = taskList;

      delete taskData.data.getTask.createdAt;
      delete taskData.data.getTask.updatedAt;

      // put updated task into database
      await API.graphql(
        graphqlOperation(updateTask, { input: taskData.data.getTask })
      );

      for (let i = 0; i < state.lists.length; i++) {
        if (state.lists[i].id == list.id) {
          state.lists[i] = list;
          return;
        }
      }
      state.lists.push(list);
    } catch (error) {
      console.log("error updating", error);
    }
  };

  const deleteList = async (list) => {
    // empty task list
    const taskList = [];

    // add all task ids for the property except the one that is being removed
    state.lists.forEach((x, i) => {
      if (x.id != list.id) {
        taskList.push(x.id);
      }
    });

    try {
      // get task data for the task that is being removed
      const taskData = await API.graphql({
        query: getTask,
        veriables: { id: list.id },
      });

      // loop through the ids of the subtasks
      for (const id of taskData.data.getTask.subtasks) {
        // get subtask data
        const subtaskData = await API.graphql({
          query: getSubtask,
          variables: { id: id },
        });

        // remove subtask from database
        await API.graphql(
          graphqlOperation(deleteSubtask, {
            input: subtaskData.data.getSubtask,
          })
        );
      }

      // remove task from database
      await API.graphql(
        graphqlOperation(deleteTask, { input: taskData.data.getTask })
      );
    } catch (error) {
      console.log("error deleting task", error);
    }

    try {
      // update task list for current property
      property.tasks = taskList;

      // update property object in database
      await API.graphql(
        graphqlOperation(updateProperty, {
          id: property,
        })
      );
    } catch (error) {
      console.log("error updating property", error);
    }

    // can be optimized
    loadData();
  };

  const renderPeople = (person) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Tenant", {
            user: navigation.getParam("user"),
            tenant: person,
            property: property,
            update: setProperty,
          })
        }
      >
        <PeopleList person={person} />
      </TouchableOpacity>
    );
  };

  async function signOut() {
    try {
      await Auth.signOut();
      navigation.reset([NavigationActions.navigate({ routeName: "Start" })]);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  if (landlordBool) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Modal
            animationType="slide"
            visible={state.addTicketVisible}
            onRequestClose={() => toggleAddTicketModal()}
          >
            <AddTicketModal
              closeModel={() => toggleAddTicketModal()}
              addList={addList}
            />
          </Modal>

          <Modal animationType="slide" visible={tenantModal}>
            <View style={styles.Modal}>
              <MaterialIcons
                name="close"
                size={24}
                style={{ ...styles.modalToggle, ...styles.modalClose }}
                onPress={() => setTenantModal(false)}
              />
              <FlatList
                data={state.people}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => pressTenant(item)}>
                    <Task text={item.name} />
                  </TouchableOpacity>
                )}
              />
            </View>
          </Modal>

          {/* May not be nessesarry */}
          <Modal animationType="slide" visible={editTenantModal}>
            <View style={styles.Modal}>
              <MaterialIcons
                name="close"
                size={24}
                style={{ ...styles.modalToggle, ...styles.modalClose }}
                onPress={() => setEditTenantModal(false)}
              />
              <TenantForm editTenant={editTenant} />
            </View>
          </Modal>
          <Modal visible={invitationModal} animationType="slide">
            <MaterialIcons
              name="close"
              size={24}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
              onPress={() => setInvitationModal(false)}
            />
            <FlatList
              data={invitations}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => console.log(item)}>
                  <Task
                    text={
                      item.tenant + "     " + (item.rejected?"(rejected)":"")
                      // item.property.number == 0
                      //   ? item.property.address
                      //   : item.property.number + " " + item.address
                    }
                  />
                </TouchableOpacity>
              )}
            />
          </Modal>

          {/*menu options*/}
          <Modal visible={modalLandlordMenuOpen} animationType="slide">
            <View>
              <MaterialIcons
                name="close"
                size={24}
                style={{ ...styles.modalToggle, ...styles.modalClose }}
                onPress={() => setmodalLandlordMenuOpen(false)}
              />
              <Button
                //style={styles.button}
                title="Logout"
                color="maroon"
                onPress={signOut}
              />
              <Button
                //style={styles.button}
                title="Refresh"
                color="blue"
                onPress={loadData}
              />
              <Button
                //style={styles.button}
                title="Delete Property"
                color="yellow"
                onPress={() => removeProperty()}
              />
              {/*<Options />*/}
            </View>
          </Modal>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 64,
            }}
          >
            <View style={styles.divider} />
            <Text style={styles.title}>
              {address}{" "}
              <Text style={{ fontWeight: "300", color: colors.blue }}>
                {" "}
                Repairs
              </Text>
            </Text>
            <View style={styles.divider} />
          </View>

          <View style={{ height: 200, paddingLeft: 32, paddingVertical: 32 }}>
            <Text style={styles.sectionTitle}>Tenants</Text>
            <FlatList
              data={state.people}
              keyExtractor={(item) => item.name}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => renderPeople(item)}
              keyboardShouldPersistTaps="always"
            />
          </View>

          {/* landlord Icon fix onpress */}
          <View style={{ height: 200, paddingLeft: 32, paddingVertical: 32 }}>
            <Text style={styles.sectionTitle}>Landlord</Text>
            <TouchableOpacity
              // onPress={() =>
              //   navigation.navigate("Tenant", {
              //     user: navigation.getParam("user"),
              //     tenant: person,
              //     property: property,
              //     update: setProperty,
              //   })
              // }
            >
              <PeopleList person={landlord} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 275, paddingLeft: 32 }}>
            <Text style={styles.sectionTitle}> Tickets</Text>
            <FlatList
              data={state.lists}
              keyExtractor={(item) => item.name}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => renderList(item)}
              keyboardShouldPersistTaps="always"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <View style={{ marginVertical: 48, alignItems: "center" }}>
              <TouchableOpacity
                style={styles.Plus}
                onPress={() => {
                  toggleAddTicketModal();
                }}
              >
                <Text style={styles.add}>Add Ticket</Text>
                <AntDesign name="plus" size={16} color={colors.blue} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => chat()}>
              <MaterialIcons name="chat" size={128} color={colors.blue} />
            </TouchableOpacity>

            <View style={{ marginVertical: 48, alignItems: "center" }}>
              <TouchableOpacity
                style={styles.Plus}
                onPress={() => {
                  //setAddType(true);
                  //toggleAddTicketModal();
                  //setTenantModal(true);
                  openAddTenant();
                }}
              >
                <Text style={styles.add}>Add Tenant</Text>
                <AntDesign name="plus" size={16} color={colors.blue} />
              </TouchableOpacity>
            </View>

            <MaterialIcons
              name="menu-open"
              size={24}
              style={styles.modalMenuToggle}
              onPress={() => setmodalLandlordMenuOpen(true)}
            />
            <MaterialIcons
              name="menu-open"
              size={24}
              style={styles.modalInvitationToggle}
              onPress={() => setInvitationModal(true)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  } else {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Modal
            animationType="slide"
            visible={state.addTicketVisible}
            onRequestClose={() => toggleAddTicketModal()}
          >
            <AddTicketModal
              closeModel={() => toggleAddTicketModal()}
              addList={addList}
            />
          </Modal>

          <Modal animationType="slide" visible={tenantModal}>
            <View style={styles.Modal}>
              <MaterialIcons
                name="close"
                size={24}
                style={{ ...styles.modalToggle, ...styles.modalClose }}
                onPress={() => setTenantModal(false)}
              />
              <FlatList
                data={state.people}
                renderItem={({ item }) => (
                  <TouchableOpacity onPress={() => pressTenant(item)}>
                    <Task text={item.name} />
                  </TouchableOpacity>
                )}
              />
            </View>
          </Modal>

          {/* May not be nessesarry */}
          <Modal animationType="slide" visible={editTenantModal}>
            <View style={styles.Modal}>
              <MaterialIcons
                name="close"
                size={24}
                style={{ ...styles.modalToggle, ...styles.modalClose }}
                onPress={() => setEditTenantModal(false)}
              />
              <TenantForm editTenant={editTenant} />
            </View>
          </Modal>

          {/*menu options*/}
          <Modal visible={modalTenantMenuOpen} animationType="slide">
            <View>
              <MaterialIcons
                name="close"
                size={24}
                style={{ ...styles.modalToggle, ...styles.modalClose }}
                onPress={() => setmodalTenantMenuOpen(false)}
              />
              <Button
                //style={styles.button}
                title="Logout"
                color="maroon"
                onPress={signOut}
              />
              <Button
                //style={styles.button}
                title="Refresh"
                color="blue"
                onPress={loadData}
              />

              <Button
                //style={styles.button}
                title="Leave Property"
                color="yellow"
                onPress={() => leaveProperty()}
              />
              {/*<Options />*/}
            </View>
          </Modal>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 64,
            }}
          >
            <View style={styles.divider} />
            <Text style={styles.title}>
              {address}{" "}
              <Text style={{ fontWeight: "300", color: colors.blue }}>
                {" "}
                Repairs
              </Text>
            </Text>
            <View style={styles.divider} />
          </View>

          <View style={{ height: 200, paddingLeft: 32, paddingVertical: 32 }}>
            <Text style={styles.sectionTitle}>Tenants</Text>
            <FlatList
              data={state.people}
              keyExtractor={(item) => item.name}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => renderPeople(item)}
              keyboardShouldPersistTaps="always"
            />
          </View>

          {/* landlord Icon fix onpress */}
          <View style={{ height: 200, paddingLeft: 32, paddingVertical: 32 }}>
            <Text style={styles.sectionTitle}>Landlord</Text>
            <TouchableOpacity
            // onPress={() =>
            //   navigation.navigate("Tenant", {
            //     user: navigation.getParam("user"),
            //     tenant: person,
            //     property: property,
            //     update: setProperty,
            //   })
            // }
            >
              <PeopleList person={landlord} />
            </TouchableOpacity>
          </View>

          <View style={{ height: 275, paddingLeft: 32 }}>
            <Text style={styles.sectionTitle}> Tickets</Text>
            <FlatList
              data={state.lists}
              keyExtractor={(item) => item.name}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => renderList(item)}
              keyboardShouldPersistTaps="always"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 10,
            }}
          >
            <View style={{ marginVertical: 48, alignItems: "center" }}>
              <TouchableOpacity
                style={styles.Plus}
                onPress={() => {
                  toggleAddTicketModal();
                }}
              >
                <Text style={styles.add}>Add Ticket</Text>
                <AntDesign name="plus" size={16} color={colors.blue} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => chat()}>
              <MaterialIcons name="chat" size={128} color={colors.blue} />
            </TouchableOpacity>

            {/* Is this your chat button?
            no above is better imo
             
            <TouchableOpacity onPress={() => chat()}>
              <MaterialIcons name="chat" size={50} color={colors.blue} />
            </TouchableOpacity>
            */}

            {/* <View style={{ marginVertical: 48, alignItems: "center" }}>
              <TouchableOpacity
                style={styles.Plus}
                onPress={() => {
                  //setAddType(true);
                  //toggleAddTicketModal();
                  //setTenantModal(true);
                  openAddTenant();
                }}
              >
                <Text style={styles.add}>Add Tenant</Text>
                <AntDesign name="plus" size={16} color={colors.blue} />
              </TouchableOpacity>
            </View> */}

            <MaterialIcons
              name="menu-open"
              size={24}
              style={styles.modalMenuToggle}
              onPress={() => setmodalTenantMenuOpen(true)}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
  divider: {
    backgroundColor: colors.lightBlue,
    height: 1,
    width: 1,
    flex: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 64,
  },
  modalMenuToggle: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "baseline",
  },
  modalInvitationToggle: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "baseline",
  },
  Plus: {
    borderWidth: 2,
    borderColor: colors.blue,
    borderRadius: 4,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    marginLeft: 5,
    color: colors.black,
  },
});
