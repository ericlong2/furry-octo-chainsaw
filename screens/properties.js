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

import Options from "./options";

import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";

import {getLandlord, getProperty} from "../src/graphql/queries";
import {createProperty, updateLandlord} from "../src/graphql/mutations";

export default function properties({ navigation }) {
  /*Constants*/
  const [modalOpen, setModalOpen] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [modal3Open, setModal3Open] = useState(false);
  const [verification, setVerification] = useState(false); //this might need to be changed
  const [number, setNumber] = useState(0);
  const [rentals, setRental] = useState([]);
  const [user, setUser] = useState("");
  const [loaded, setLoaded] = useState(false);

  const submitVerif = (code) => {
    console.log(code);
    //here you can verify and close window by using
    //setModal3Open(false)
    //also your gonna need to scan if the acc has been verified or not or smt
  };
  
  const loadProperties = async() => {

    if (!loaded) {
      setLoaded(true);
      // load properties that have already been added previously
      try {

        // get the current user
        const curUser = await Auth.currentAuthenticatedUser();
        //console.log("user",curUser.attributes);
        setUser(curUser.attributes.email);


        // get the landlord object corresponding to current user
        const landlord = await API.graphql({
          query: getLandlord,
          variables: {id:curUser.attributes.email}
        });

        //console.log("loading properties for",landlord.data.getLandlord);
        // load properties into rental list
        const properties = landlord.data.getLandlord.properties;

        

        for (const property of properties) {

          // Load property details
          const rental = await API.graphql({
            query:getProperty,
            variables: {id: property},
          });

          // output property details
          console.log(rental.data.getProperty);

          // add to rentals
          setRental((currentRentals)=>{
            return [rental.data.getProperty, ...currentRentals];
          });
        }
        
          //console.log("finished retrieving properties");
      
      } catch (error) {
        console.log("error loading properties:",error);
      }
    }
  }
  loadProperties();

  const generateID = () => {
    return Math.random().toString();
  }
  const addProperty = async (rental) => {
    try {

      console.log(rental);
      // create a new property object for rental
      const rentalData = await API.graphql(
        graphqlOperation(createProperty, { input: rental })
      );

      // get current landlord
      const tmp = await API.graphql({
        query: getLandlord,
        variables: { id: user },
      });

      const landlord = tmp.data.getLandlord;
      delete landlord.createdAt;
      delete landlord.updatedAt;

      // add property to landlord's property list
      landlord.properties.push(rental.id);

      console.log(landlord);
      const landlordData = await API.graphql(
        graphqlOperation(updateLandlord, { input: landlord })
      );

      // update the rental list
      setRental((currentRentals) => {
        return [rental, ...currentRentals];
      });
    } catch (error) {
      console.log("error adding", error);
    }
  };

  const addRental = (rental) => {
    //change this to not random
    rental.id = generateID();
    rental.issues = 0;
    rental.number = number;
    rental.tasks = [];
    rental.tenants = [];
    rental.landlord = user;
    setNumber(0);
    addProperty(rental);
    setModalOpen(false);
  };


  /*Functions */
  const pressRental = (item) => {
    //let item = rentals[key];
    navigation.navigate("RentalDetails", item);
    //return <RentalPage address={item.address} />;
  };
 
  async function signOut() {
    try {
        await Auth.signOut();
        navigation.navigate("Start");
    } catch (error) {
        console.log('error signing out: ', error);
    }
  }

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
            onPress={signOut}
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
