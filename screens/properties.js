import React, { useState, useEffect } from "react";
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
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import GooglePlacesInput from "./GooglePlacesInput";
import { CommonActions } from "@react-navigation/native";

import Options from "./options";

import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";

import { getLandlord, getProperty, getUser } from "../src/graphql/queries";
import { createChatRoom, createProperty, updateLandlord, updateUser } from "../src/graphql/mutations";
import { NavigationActions } from "react-navigation";
import { set } from "react-native-reanimated";
import { onUpdateLandlord } from "../src/graphql/subscriptions";

export default function properties({ navigation }) {
  /*Constants*/
  const [modalOpen, setModalOpen] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [number, setNumber] = useState(0);
  const [rentals, setRental] = useState([]);
  const [landlord, setLandlord] = useState({});

  const loadProperties = async () => {
      const tmp = [];
      // load properties that have already been added previously
      try {
        // get the landlord object corresponding to current user
        const landlordData = await API.graphql({
          query: getLandlord,
          variables: { id: navigation.getParam("user").email },
        });

        delete landlordData.data.getLandlord.createdAt;
        delete landlordData.data.getLandlord.updatedAt;

        // set local landlord
        setLandlord(landlordData.data.getLandlord);

        // load properties into rental list
        const properties = landlordData.data.getLandlord.properties;

        for (const property of properties) {
          // Load property details
          console.log(property);
          const rental = await API.graphql({
            query: getProperty,
            variables: { id: property },
          });

          delete rental.data.getProperty.createdAt;
          delete rental.data.getProperty.updatedAt;
          // output property details
          console.log(rental.data.getProperty);

          // add to rentals
          tmp.push(rental.data.getProperty);
        }
        setRental(tmp);
        //console.log("finished retrieving properties");
      } catch (error) {
        console.log("error loading properties:", error);
      }
    
  };
  useEffect(() => {
    loadProperties();
  }, [])

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateLandlord)
    ).subscribe({
      next: (data) => {
        const newLandlord = data.value.data.onUpdateLandlord;

        if (newLandlord.id !== navigation.getParam("user").email) {
          console.log("Message is in another room!")
          return;
        }
        loadProperties();
        // setMessages([newMessage, ...messages]);
      }
    });

    return () => subscription.unsubscribe();
  }, [])

  const generateID = () => {
    return Math.random().toString();
  };

  const addProperty = async (rental) => {
    try {
      console.log(rental);
      const chatRoom = {id: generateID(),name:rental.address,chatRoomUsers:[navigation.getParam("user").email],messages:[]};
    
      rental.chatRoomID = chatRoom.id;
      await API.graphql(graphqlOperation(createChatRoom, {input: chatRoom}));

      const userData = await API.graphql(graphqlOperation(getUser,{id:navigation.getParam("user").email}));
      delete userData.data.getUser.createdAt;
      delete userData.data.getUser.updatedAt;
      userData.data.getUser.chatRooms.push(chatRoom.id);
      await API.graphql(graphqlOperation(updateUser,{input:userData.data.getUser}));

      // create a new property object for rental
      await API.graphql(graphqlOperation(createProperty, { input: rental }));

      // add property to landlord's property list
      landlord.properties.push(rental.id);

      await API.graphql(graphqlOperation(updateLandlord, { input: landlord }));

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
    rental.landlord = navigation.getParam("user").email;
    rental.invitations = [];
    setNumber(0);
    addProperty(rental);
    setModalOpen(false);
  };

  /*Functions */
  const pressRental = (item) => {
    const info = {user:navigation.getParam("user"),property:item};
    navigation.navigate("RentalDetails", info);
  };

  async function signOut() {
    try {
      await Auth.signOut();
      navigation.reset([NavigationActions.navigate({ routeName: "Start" })]);
    } catch (error) {
      console.log("error signing out: ", error);
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
          <Button
            //style={styles.button}
            title="Refresh"
            color="blue"
            onPress={loadProperties}
          />
          {/*<Options />*/}
        </View>
      </Modal>



      <View style={styles.tasksWrapper}>


          <View style = {{
             flexDirection: 'row', 
             justifyContent: 'space-between', 
             marginRight: 50,
           }}> 
           
           <MaterialIcons
              name="settings"
              size={30}
              onPress={() => setModal2Open(true)}
            />
            <Text style={styles.sectionTitle}>Properties</Text>

            
          

        </View>
  


      
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



      {/* <View style={styles.buttonContainer}>
        <MaterialCommunityIcons name="chat" size={28} color="white" />
      </View> */}

      <MaterialIcons
        name="add"
        backgroundColor = "green"
        size={24}
        style={styles.modalToggle}
        onPress={() => setModalOpen(true)}
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
    flexDirection: 'row', 
    width: 1000, 
    justifyContent: 'space-between', 
    marginRight: 10,
  },
  items: {
    marginTop: 30,
  },
  buttonContainer: {
    backgroundColor: "black",
    borderRadius: 50,
    width: 45,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 40,
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
