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

import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";

import {getProperty,getTenant,getTask, getSubtask} from "../src/graphql/queries";
import {createTask,createTenant, deleteSubtask, updateProperty, updateTask} from "../src/graphql/mutations";
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

  const generateID = () => {
    return Math.random().toString();
  }

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
          const taskData = await API.graphql({
            query: getTask,
            variables: { id : id},
          });
          console.log(taskData);
          const curTask = taskData.data.getTask;
          curTask.subtasks = [];

          for (const subtask of taskData.data.getTask.subtasks) {
            const subtaskData = await API.graphql({
              query: getSubtask,
              variables: {id:subtask},
            });
            curTask.subtasks.push(subtaskData.data.getSubtask);
          }


          taskList.push(curTask);
          // setTaskList((currentTasks)=>{
          //   return [taskData.data.getTask, ...currentTasks];
          // });
        }


        setTenantList([]);
        for (const id of propertyData.data.getProperty.tenants) {
          const tenantData = await API.graphql({
            query: getTenant,
            variables: { id : id},
          });
          
          //remove later
          tenantData.data.getTenant.subtasks = [];

          setTenantList((currentTenants)=>{
            return [tenantData.data.getTenant, ...currentTenants];
          });
        }

        setState({
          addTicketVisible: state.addTicketVisible,
          lists:taskList,
          people:tenantList,
        });

        console.log(state);
        console.log(taskList);
        console.log(tenantList);
      } catch (error) {
        console.log("error retrieving property data",error);
      }
    }
  }
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
          graphqlOperation(updateProperty, {input:propertyData.data.getProperty})
        );

        setState({
          lists: [
            ...state.lists,
            list
          ],
        });
      } catch (error) {
        console.log("error adding list",error);
      }
    } else {
      delete list.color;
      try {
        await API.graphql(
          graphqlOperation(createTenant, { input: list })
        );
        const propertyData = await API.graphql({
          query: getProperty,
          variables: { id: navigation.getParam("id") },
        });
        propertyData.data.getProperty.tenants.push(list.id);

        setState({
          people: [
            ...state.people,
            list
          ],
        });
      } catch (error) {
        console.log("error adding list",error);
      }
    }
    console.log(list);
    
    console.log(state.lists);
  };

  const updateList = async (list) => {
    // setState({
    //   lists: state.lists.map((item) => {
    //     return item.id === list.id ? list : item;
    //   }),
    // });
    
    try {
      const taskData = await API.graphql({
        query: getTask,
        variables: { id: list.id},
      });

      taskData.data.getTask.subtasks.push(list.subtasks[list.subtasks.length-1].id);

      delete taskData.data.getTask.createdAt;
      delete taskData.data.getTask.updatedAt;

      const tmp = await API.graphql(
        graphqlOperation(updateTask, { input: taskData.data.getTask })
      );
    } catch (error) {
      console.log("error updating",error);
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
      state.lists.forEach((x,i)=>{
        if (x.id!=list.id) {
          setTaskList((currentTasks)=>{
            return [x.id, ...currentTasks];
          });
        }
      });
      try {
        const taskData = await API.graphql({
          query: getTask,
          veriables: {id: list.id},
        });

        for (const id of taskData.data.getTask.subtasks) {
            const subtaskData = await API.graphql({
              query: getSubtask,
              variables: {id: id},
            })

            const tmp = await API.graphql(
              graphqlOperation(deleteSubtask, {input: subtaskData.data.getSubtask})
            );
        }

        const tmp = await API.graphql(
          graphqlOperation(deleteTask, { input: taskData.data.getTask})
        );

      } catch (error) {
        console.log("error deleting task",error);
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
          graphqlOperation(updateProperty, { id: propertyData.data.getProperty })
        );
      } catch (error) {
        console.log("error updating",error);
      }
      setLoaded(false);
      loadData();
    }
  };

  const renderPeople = (person) => {
    return <PeopleList person={person} />;
  };

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

          <TouchableOpacity
            onPress={()=>navigation.navigate("Home")}
            >
            
            <MaterialIcons name="home" size={128} color={colors.blue} />
          </TouchableOpacity>

          <View style={{ marginVertical: 48, alignItems: "center" }}>
            <TouchableOpacity
              style={styles.Plus}
              onPress={() => {
                setAddType(true);
                toggleAddTicketModal();
              }}
            >
              <Text style={styles.add}>Add Tenant</Text>
              <AntDesign name="plus" size={16} color={colors.blue} />
            </TouchableOpacity>
          </View>
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

