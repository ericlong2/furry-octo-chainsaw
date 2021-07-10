import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
} from "react-native";
import colors from "./Colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import tempData from "./tempData";
import tempPeople from "./tempPeople";
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
} from "../src/graphql/queries";
import {
  createTask,
  createTenant,
  deleteSubtask,
  updateProperty,
  updateTask,
} from "../src/graphql/mutations";
import Task from "../components/Task";
import TenantForm from "./TenantForm";
{
  /* https://www.youtube.com/watch?v=ce-ancZvtKE&list=PLqtWgQ5BRLPvbmeIYf769yb25g4W8NUZo&index=3 */
}

export default function rentalPage({ navigation }) {
  const [state, setState] = useState({
    addTicketVisible: false,
    lists: [],
    people: [],
  });

  const [loaded, setLoaded] = useState(false);
  const [taskList, setTaskList] = useState([]);
  const [tenantList, setTenantList] = useState([]);
  const [addType, setAddType] = useState(false);
  const [tenantModal, setTenantModal] = useState(false);
  const [currentTenant, setCurrentTenant] = useState();
  const [editTenantModal, setEditTenantModal] = useState(false);
  const [modalMenuOpen, setModalMenuOpen] = useState(false);

  //note: this needs to alwasy have a create new tenant at the end of the list cuz used instead of button
  const [tenants, setTenants] = useState([
    {
      name: "Bob",
    },
    {
      name: "Create new tenant",
    },
  ]);

  //open modal with the tenant details
  const pressTenant = (item) => {
    //navigation.navigate("TenantForm", item);
    setCurrentTenant(item);
    setEditTenantModal(true);
  };

  const editTenant = () => {
    console.log("edit tenant");
    setEditTenantModal(false);
    //need to place a :new tenant at end if that was what was edited
  };
  const generateID = () => {
    return Math.random().toString();
  };

  const address = navigation.getParam("address");
  //const address = "";
  const loadData = async () => {
    if (!loaded) {
      state.lists = [];
      state.people = [];
      setLoaded(true);
      try {
        const propertyData = await API.graphql({
          query: getProperty,
          variables: { id: navigation.getParam("id") },
        });
        console.log(propertyData);
        setTaskList([]);
        for (const id of propertyData.data.getProperty.tasks) {
          //console.log(id);
          const taskData = await API.graphql({
            query: getTask,
            variables: { id: id },
          });
          //console.log(taskData);
          const curTask = taskData.data.getTask;
          curTask.subtaskList = [];
          console.log(curTask.subtasks);
          for (const subtask of curTask.subtasks) {
            console.log(subtask);
            const subtaskData = await API.graphql({
              query: getSubtask,
              variables: { id: subtask },
            });
            //console.log(subtaskData);
            curTask.subtaskList.push(subtaskData.data.getSubtask);
          }
          console.log("before", curTask);
          curTask.subtasks = curTask.subtaskList;
          delete curTask.subtaskList;

          console.log("loading task", curTask);
          taskList.push(curTask);
          // setTaskList((currentTasks)=>{
          //   return [taskData.data.getTask, ...currentTasks];
          // });
        }

        setTenantList([]);
        for (const id of propertyData.data.getProperty.tenants) {
          const tenantData = await API.graphql({
            query: getTenant,
            variables: { id: id },
          });

          //remove later
          //tenantData.data.getTenant.subtasks = [];

          tenantList.push(tenantData.data.getTenant);
          // setTenantList((currentTenants)=>{
          //   return [tenantData.data.getTenant, ...currentTenants];
          // });
        }

        setState({
          addTicketVisible: state.addTicketVisible,
          lists: taskList,
          people: tenantList,
        });

        console.log(state);
        console.log(taskList);
        console.log(tenantList);
      } catch (error) {
        console.log("error retrieving property data", error);
      }
    }
  };
  loadData();
  //console.log(navigation.address);
  //address = props.get("address");

  const toggleAddTicketModal = () => {
    setState({
      addTicketVisible: !state.addTicketVisible,
      lists: state.lists,
      people: state.people,
    });
    console.log(state.addTicketVisible);
  };

  const renderList = (list) => {
    return (
      <TicketList list={list} updateList={updateList} deleteList={deleteList} />
    );
  };

  const addList = async (list) => {
    list.id = generateID();
    if (!addType) {
      list.subtasks = [];
      try {
        const tmp = await API.graphql(
          graphqlOperation(createTask, { input: list })
        );
        const propertyData = await API.graphql({
          query: getProperty,
          variables: { id: navigation.getParam("id") },
        });
        propertyData.data.getProperty.tasks.push(list.id);
        delete propertyData.data.getProperty.createdAt;
        delete propertyData.data.getProperty.updatedAt;

        await API.graphql(
          graphqlOperation(updateProperty, {
            input: propertyData.data.getProperty,
          })
        );

        //state.lists.push(list);
        setState({
          lists: [...state.lists, list],
          addTicketVisible: false,
          people: state.people,
        });
      } catch (error) {
        console.log("error adding list", error);
      }
    } else {
      delete list.color;
      try {
        await API.graphql(graphqlOperation(createTenant, { input: list }));
        const propertyData = await API.graphql({
          query: getProperty,
          variables: { id: navigation.getParam("id") },
        });
        propertyData.data.getProperty.tenants.push(list.id);

        delete propertyData.data.getProperty.createdAt;
        delete propertyData.data.getProperty.updatedAt;

        await API.graphql(
          graphqlOperation(updateProperty, {
            input: propertyData.data.getProperty,
          })
        );

        console.log("adding tenant", list);
        //state.people.push(list);
        setState({
          people: [...state.people, list],
          addTicketVisible: false,
          lists: state.lists,
        });
      } catch (error) {
        console.log("error adding list", error);
      }
    }

    console.log(state);
  };

  const updateList = async (list) => {
    // setState({
    //   lists: state.lists.map((item) => {
    //     return item.id === list.id ? list : item;
    //   }),
    // });
    setTaskList([]);
    console.log("list", list);
    for (let i = 0; i < list.subtasks.length; i++) {
      taskList.push(list.subtasks[i].id);
    }
    try {
      const taskData = await API.graphql({
        query: getTask,
        variables: { id: list.id },
      });

      taskData.data.getTask.subtasks = taskList;

      delete taskData.data.getTask.createdAt;
      delete taskData.data.getTask.updatedAt;

      const tmp = await API.graphql(
        graphqlOperation(updateTask, { input: taskData.data.getTask })
      );

      console.log("added subtask", taskData);
    } catch (error) {
      console.log("error updating", error);
    }
  };

  const deleteList = async (list) => {
    {
      /*add this method to Fire.js
deleteList(list){
        let ref =  ref;
        ref.doc(list.id).delete()
    }
this method in App.js
deleteList = list => {
    firebase.deleteList(list);
  };
    */
      setTaskList([]);
      state.lists.forEach((x, i) => {
        if (x.id != list.id) {
          setTaskList((currentTasks) => {
            return [x.id, ...currentTasks];
          });
        }
      });
      try {
        const taskData = await API.graphql({
          query: getTask,
          veriables: { id: list.id },
        });

        for (const id of taskData.data.getTask.subtasks) {
          const subtaskData = await API.graphql({
            query: getSubtask,
            variables: { id: id },
          });

          const tmp = await API.graphql(
            graphqlOperation(deleteSubtask, {
              input: subtaskData.data.getSubtask,
            })
          );
        }

        const tmp = await API.graphql(
          graphqlOperation(deleteTask, { input: taskData.data.getTask })
        );
      } catch (error) {
        console.log("error deleting task", error);
      }

      try {
        const propertyData = await API.graphql({
          query: getProperty,
          variables: { id: navigation.getParam("id") },
        });
        propertyData.data.getProperty.tasks = taskList;

        delete propertyData.data.getProperty.createdAt;
        delete propertyData.data.getProperty.updatedAt;

        const tmp = await API.graphql(
          graphqlOperation(updateProperty, {
            id: propertyData.data.getProperty,
          })
        );
      } catch (error) {
        console.log("error updating", error);
      }
      setLoaded(false);
      loadData();
    }
  };

  const renderPeople = (person) => {
    return <PeopleList person={person} />;
  };

  async function signOut() {
    try {
      await Auth.signOut();
      navigation.navigate("Start");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  async function refresh() {
    // try {
    //     await Auth.signOut();
    //     navigation.navigate("Start");
    // } catch (error) {
    //     console.log('error signing out: ', error);
    // }
  }
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
              data={tenants}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => pressTenant(item)}>
                  <Task text={item.name} />
                </TouchableOpacity>
              )}
            />
          </View>
        </Modal>

        <Modal animationType="slide" visible={editTenantModal}>
          <View style={styles.Modal}>
            <MaterialIcons
              name="close"
              size={24}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
              onPress={() => setEditTenantModal(false)}
            />
            <TenantForm editTenant={editTenant} tenant={currentTenant} />
          </View>
        </Modal>

        {/*menu options*/}
        <Modal visible={modalMenuOpen} animationType="slide">
          <View>
            <MaterialIcons
              name="close"
              size={24}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
              onPress={() => setModalMenuOpen(false)}
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
              onPress={refresh}
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
          <Text style={styles.sectionTitle}>Tenents</Text>
          <FlatList
            data={state.people}
            keyExtractor={(item) => item.name}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => renderPeople(item)}
            keyboardShouldPersistTaps="always"
          />
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
                setAddType(false);
                toggleAddTicketModal();
              }}
            >
              <Text style={styles.add}>Add Ticket</Text>
              <AntDesign name="plus" size={16} color={colors.blue} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <MaterialIcons name="home" size={128} color={colors.blue} />
          </TouchableOpacity>

          <View style={{ marginVertical: 48, alignItems: "center" }}>
            <TouchableOpacity
              style={styles.Plus}
              onPress={() => {
                setAddType(true);
                //toggleAddTicketModal();
                setTenantModal(true);
              }}
            >
              <Text style={styles.add}>Add/Edit Tenants</Text>
              <AntDesign name="plus" size={16} color={colors.blue} />
            </TouchableOpacity>
          </View>

          <MaterialIcons
            name="menu-open"
            size={24}
            style={styles.modalMenuToggle}
            onPress={() => setModalMenuOpen(true)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
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
