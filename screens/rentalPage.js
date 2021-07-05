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
} from "react-native";
import colors from "./Colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import tempData from "./tempData";
import tempPeople from "./tempPeople";
import TicketList from "./TicketList";
import PeopleList from "./PeopleList";
import AddTicketModal from "./AddTicketModal";

{
  /* https://www.youtube.com/watch?v=ce-ancZvtKE&list=PLqtWgQ5BRLPvbmeIYf769yb25g4W8NUZo&index=3 */
}

export default function rentalPage({ navigation }) {
  const [state, setState] = useState({
    addTicketVisible: false,
    lists: tempData,
    people: tempPeople,
  });
  const address = navigation.getParam("address");
  console.log(navigation.address);
  //address = props.get("address");

  const toggleAddTicketModal = () => {
    setState({
      addTicketVisible: !state.addTicketVisible,
      // lists: state.tempData,
      // people: state.tempPeople,
    });
    console.log(state.addTicketVisible);
  };

  const renderList = (list) => {
    return (
      <TicketList list={list} updateList={updateList} deleteList={deleteList} />
    );
  };

  const addList = (list) => {
    setState({
      lists: [
        ...state.lists,
        { ...list, id: state.lists.length + 1, todos: [] },
      ],
    });
  };

  const updateList = (list) => {
    setState({
      lists: state.lists.map((item) => {
        return item.id === list.id ? list : item;
      }),
    });
  };

  const deleteList = (list) => {
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
    }
  };

  const renderPeople = (person) => {
    return <PeopleList person={person} />;
  };

  return (
    <SafeAreaView style={styles.container}>
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
            onPress={() => toggleAddTicketModal()}
          >
            <Text style={styles.add}>Add Ticket</Text>
            <AntDesign name="plus" size={16} color={colors.blue} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          {/* add onPress navigation back to properties page */}
          <MaterialIcons name="home" size={128} color={colors.blue} />
        </TouchableOpacity>

        <View style={{ marginVertical: 48, alignItems: "center" }}>
          <TouchableOpacity
            style={styles.Plus}
            onPress={() => toggleAddTicketModal()}
          >
            <Text style={styles.add}>Add Tenent</Text>
            <AntDesign name="plus" size={16} color={colors.blue} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
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
