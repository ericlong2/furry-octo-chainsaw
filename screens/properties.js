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
  Button,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import Task from "../components/Task";
import AddForm from "./AddForm";
import { MaterialIcons } from "@expo/vector-icons";
import GooglePlacesInput from "./GooglePlacesInput";
import RentalPage from "./rentalPage";
import Options from "./options";

export default function properties({ navigation }) {
  /*Constants*/
  const [modalOpen, setModalOpen] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [modal3Open, setModal3Open] = useState(false);
  const [verification, setVerification] = useState(false); //this might need to be changed
  const [number, setNumber] = useState(0);
  const [rentals, setRental] = useState([
    { address: "220 Yonge Street", city: "Toronto", issues: 0, key: "1" },
    { address: "1442 Lawrence Ave W", city: "Toronto", issues: 3, key: "2" },
    { address: "2925 Dufferin St", city: "Toronto", issues: 2, key: "3" },
    { address: "2350 Bridletowne Cir", city: "Toronto", issues: 1, key: "4" },
  ]);

  const submitVerif = (code) => {
    console.log(code);
    //here you can verify and close window by using
    //setModal3Open(false)
    //also your gonna need to scan if the acc has been verified or not or smt
  };

  const addRental = (rental) => {
    //change this to not random
    rental.key = Math.random().toString();
    rental.issues = 0;
    rental.number = number;
    setRental((currentRentals) => {
      return [rental, ...currentRentals];
    });
    setModalOpen(false);
  };
  /*Functions */
  const pressRental = (item) => {
    console.log(item.key);
    //let item = rentals[key];
    //navigation.navigate("RentalDetails", item);
    return <RentalPage address={item.address} />;
    console.log("h");
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
    <View style={styles.container}>
      {/*add house*/}
      <Modal visible={modalOpen} animationType="slide">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <MaterialIcons
              name="close"
              size={24}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
              onPress={() => setModalOpen(false)}
            />

            <View style={styles.googleInput}>
              <TextInput
                style={styles.TextInput}
                placeholder="Apt number(optional)"
                onChangeText={(number) => setNumber(number)}
                //defaultValue={number}
                keyboardType="numeric"
              />
              <GooglePlacesInput addRental={addRental} />
            </View>
            {/*<AddForm addRental={addRental} />*/}
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/*menu options*/}
      <Modal visible={modal2Open} animationType="slide">
        <View>
          <MaterialIcons
            name="close"
            size={24}
            style={{ ...styles.modalToggle, ...styles.modalClose }}
            onPress={() => setModal2Open(false)}
          />
          <Button
            //style={styles.button}
            title="Logout"
            color="maroon"
            onPress={() => console.log("logout")}
          />
          {/*<Options />*/}
        </View>
      </Modal>

      {/* email verification*/}
      <Modal visible={modal3Open} animationType="slide">
        <View>
          <TextInput
            style={styles.TextInput}
            placeholder="Apt number(optional)"
            onChangeText={(number) => setVerification(number)}
            //defaultValue={number}
            keyboardType="numeric"
          />
          <Button
            //style={styles.button}
            title="Submit"
            color="maroon"
            onPress={() => submitVerif(verification)}
          />
          {/*<Options />*/}
        </View>
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
                <Task
                  text={
                    item.number == 0
                      ? item.address
                      : item.number + " " + item.address
                  }
                />
              </TouchableOpacity>
            )}
          />
        </View>
      </View>

      <MaterialIcons
        name="menu-open"
        size={24}
        style={styles.modal2Toggle}
        onPress={() => setModal2Open(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  TextInput: {
    paddingBottom: 10,
    backgroundColor: "grey",
    color: "white",
  },
  googleInput: {
    flex: 1,
    marginTop: 20,
    paddingBottom: 30,
  },
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
  modal2Toggle: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "baseline",
  },
  modalClose: {
    marginTop: 20,
    marginBottom: 0,
  },
  modalContent: {
    flex: 1,
  },
});
