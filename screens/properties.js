import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import Task from "../components/Task";
import AddForm from "./AddForm";
import { MaterialIcons } from "@expo/vector-icons";

export default function properties({ navigation }) {
  /*Constants*/
  const [modalOpen, setModalOpen] = useState(false);
  const [rentals, setRental] = useState([
    { address: "220 Yonge Street", city: "Toronto", issues: 0, key: "1" },
    { address: "1442 Lawrence Ave W", city: "Toronto", issues: 3, key: "2" },
    { address: "2925 Dufferin St", city: "Toronto", issues: 2, key: "3" },
    { address: "2350 Bridletowne Cir", city: "Toronto", issues: 1, key: "4" },
  ]);

  const addRental = (rental) => {
    //change this to not random
    rental.key = Math.random().toString();
    rental.issues = 0;
    setRental((currentRentals) => {
      return [rental, ...currentRentals];
    });
    setModalOpen(false);
  };
  /*Functions */
  const pressRental = (item) => {
    console.log(item.key);
    //let item = rentals[key];
    navigation.navigate("RentalDetails", item);
  };

  const handleAddTask = () => {
    Alert.alert("Add Property", "Do you wish to add a new rental property", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Presssed"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => navigation.navigate("AddRental"),
      },
    ]);
  };

  return (
    <View style={StyleSheet.container}>
      <Modal visible={modalOpen} animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <MaterialIcons
              name="close"
              size={24}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
              onPress={() => setModalOpen(false)}
            />
            <AddForm addRental={addRental} />
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <MaterialIcons
        name="add"
        size={24}
        style={styles.modalToggle}
        onPress={() => setModalOpen(true)}
      />

      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Properties</Text>
        {/*Properties list*/}
        <View style={styles.items}>
          <FlatList
            data={rentals}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => pressRental(item)}>
                <Task text={item.address} />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  tasksWrapper: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  items: {
    marginTop: 30,
  },
  modalToggle: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },
  modalContent: {
    flex: 1,
  },
});
