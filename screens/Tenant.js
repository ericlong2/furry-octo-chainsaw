import { StatusBar } from "expo-status-bar";
import React from "react";
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
{
  /* https://www.youtube.com/watch?v=ce-ancZvtKE&list=PLqtWgQ5BRLPvbmeIYf769yb25g4W8NUZo&index=3 */
}

export default class Tenant extends React.Component {
  state = {
    addTicketVisible: false,
    lists: tempData,
    people: tempPeople,
  };

  toggleAddTicketModal() {
    this.setState({ addTicketVisible: !this.state.addTicketVisible });
  }

  renderList = (list) => {
    return (
      <TicketList
        list={list}
        updateList={this.updateList}
        deleteList={this.deleteList}
      />
    );
  };

  addList = (list) => {
    this.setState({
      lists: [
        ...this.state.lists,
        { ...list, id: this.state.lists.length + 1, todos: [] },
      ],
    });
  };

  updateList = (list) => {
    this.setState({
      lists: this.state.lists.map((item) => {
        return item.id === list.id ? list : item;
      }),
    });
  };

  deleteList = (list) => {
    {
      /*add this method to Fire.js
deleteList(list){
        let ref = this.ref;
        ref.doc(list.id).delete()
    }
this method in App.js
deleteList = list => {
    firebase.deleteList(list);
  };
    */
    }
  };

  renderPeople = (person) => {
    return <PeopleList person={person} />;
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Modal
            animationType="slide"
            visible={this.state.addTicketVisible}
            onRequestClose={() => this.toggleAddTicketModal()}
          >
            <AddTicketModal
              closeModel={() => this.toggleAddTicketModal()}
              addList={this.addList}
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
              House{" "}
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
              data={this.state.people}
              keyExtractor={(item) => item.name}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => this.renderPeople(item)}
              keyboardShouldPersistTaps="always"
            />
          </View>

          <View style={{ height: 275, paddingLeft: 32 }}>
            <Text style={styles.sectionTitle}> Tickets</Text>
            <FlatList
              data={this.state.lists}
              keyExtractor={(item) => item.name}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => this.renderList(item)}
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
                onPress={() => this.toggleAddTicketModal()}
              >
                <Text style={styles.add}>Add Ticket</Text>
                <AntDesign name="plus" size={16} color={colors.blue} />
              </TouchableOpacity>
            </View>
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
