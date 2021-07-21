import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";
import React, { useState } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Button,
  Text,
} from "react-native";
import Task from "../components/Task";
import { MaterialIcons } from "@expo/vector-icons";
import colors from "./Colors";
import { updateProperty, updateTenant } from "../src/graphql/mutations";
import { getInvitation, getProperty, getTenant } from "../src/graphql/queries";

export default function invitationPage({ navigation }) {
  const [invitations, setInvitations] = useState([]);
  const [invitationModal, setInvitationModal] = useState(false);
  const [currentInvitation, setCurrentInvitation] = useState();
  const [modalMenuOpen, setModalMenuOpen] = useState(false);

  const [loaded, setLoaded] = useState(false);
  const [tenant, setTenant] = useState({});

  async function signOut() {
    try {
      await Auth.signOut();
      navigation.reset([NavigationActions.navigate({ routeName: "Start" })]);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  async function refresh() {
    setLoaded(false);
    loadData();
  }

  const loadInvitations = async () => {
    if (!loaded) {
      setLoaded(true);
      try {

        // get tenant object
        const tenantData = await API.graphql({
          query: getTenant,
          variables: { id: navigation.getParam("email") },
        });

        delete tenantData.data.getTenant.createdAt;
        delete tenantData.data.getTenant.updatedAt;

        setTenant(tenantData.data.getTenant);

        // go through list of invitations
        for (const invitation of tenantData.data.getTenant.invitations) {
          
          if (
            tenantData.data.getTenant.accepted != null &&
            invitation == tenantData.data.getTenant.accepted
          )
            continue;

          // get invitation object
          const invitationData = await API.graphql({
            query: getInvitation,
            variables: { id: invitation },
          });

          // get corresponding property
          const propertyData = await API.graphql({
            query: getProperty,
            variables: { id: invitationData.data.getInvitation.propertyID },
          });

          // combine the property with invitation
          propertyData.data.getProperty.propertyID = propertyData.data.getProperty.id;
          propertyData.data.getProperty.id = invitation;

          propertyData.data.getProperty.rentAmount = invitationData.data.getInvitation.rentAmount;
          propertyData.data.getProperty.leaseStart = invitationData.data.getInvitation.leaseStart;
          propertyData.data.getProperty.leaseTerm = invitationData.data.getInvitation.leaseTerm;

          // add to invitation list
          setInvitations((currentInvitations) => {
            return [propertyData.data.getProperty, ...currentInvitations];
          });
        }
      } catch (error) {
        console.log("error loading invitations", error);
      }
    }
  };

  loadInvitations();

  const removeInvitation = (id) => {
    const list = invitations;
    setInvitations([]);
    for (const invitation of list) {
      if (invitation.id != id) {
        // add to invitation list
        setInvitations((currentInvitations) => {
          return [invitation, ...currentInvitations];
        });
      }
    }
  }

  const pressInvitation = (item) => {
    console.log(item);
    setCurrentInvitation(item);
    setInvitationModal(true);
  };

  const reject = async () => {
    try {
      // new list of invitations
      const tmpList = [];

      for (const invitation of tenantData.data.getTenant.invitations) {
        if (invitation != currentInvitation.id) {
          tmpList.push(invitation);
        }
      }

      tenant.invitations = tmpList;

      await API.graphql(
        graphqlOperation(updateTenant, {
          input: tenant,
        })
      );

      removeInvitation(currentInvitation.id);

    } catch (error) {
      console.log("error rejecting invitation", error);
    }
  };

  const toRental = async () => {
    try {

      if (tenant.accepted == null) {
        //is not apart of any house place alert
        Alert.alert(
          "No Rental",
          "A rental invitation has not yet been accepted. To continue accept the appropriate rental invitation or request your landlord to resend the invitation",
          [
            {
              text: "OK",
              onPress: () => console.log("Ok pressed"),
            },
          ]
        );
      } else {
        const invitationData = await API.graphql({
          query: getInvitation,
          variables: { id: tenant.accepted },
        });

        const propertyData = await API.graphql({
          query: getProperty,
          variables: { id: invitationData.data.getInvitation.propertyID },
        });
      
        delete propertyData.data.getProperty.updatedAt;
        delete propertyData.data.getProperty.createdAt;
        //navigate to tenant page after
        const item = {email:navigation.getParam("email"), "custom:landlord":navigation.getParam("custom:landlord"),property:propertyData.data.getProperty};
        navigation.navigate("RentalDetails", item);
      }
    } catch (error) {
      console.log("error checking if tenant accepted an invitation", error);
    }
  };

  const accept = async () => {
    // if no invitation selected, do nothing
    if (currentInvitation == null) return;
    try {
      console.log("accept");
      //console.log(item);

      // make sure tenant isn't already in a property
      if (tenant.accepted != null) return;

      // update tenants accepted
      tenant.accepted = currentInvitation.id;

      // update in database
      await API.graphql(
        graphqlOperation(updateTenant, {
          input: tenantData.data.getTenant,
        })
      );

      removeInvitation(currentInvitation.id);

      //navigate to tenant page after
      const item = {email:navigation.getParam("email"), "custom:landlord":navigation.getParam("custom:landlord"),property:propertyData.data.getProperty};
      navigation.navigate("RentalDetails", item);
    } catch (error) {
      console.log("error accepting invitation", error);
    }
  };

  if (currentInvitation == null) {
    return (
      <View>
        {/*Invitation modal*/}
        <Modal visible={invitationModal} animationType="slide">
          <View>
            <MaterialIcons
              name="close"
              size={24}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
              onPress={() => {
                setCurrentInvitation();
                setInvitationModal(false);
              }}
            />
            <Button
              //style={styles.button}
              title="Accept"
              color="blue"
              onPress={accept}
            />
            <Button
              //style={styles.button}
              title="Reject"
              color="maroon"
              onPress={reject}
            />
            {/* <Button
              //style={styles.button}
              title="Cancel"
              color="maroon"
              onPress={() => {
                setCurrentInvitation();
                setInvitationModal(false);
              }}
            /> */}
            {/*<Options />*/}
          </View>
        </Modal>

        <Text style={styles.sectionTitle}>Invitations</Text>
        <FlatList
          data={invitations}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => pressInvitation(item)}>
              <Task
                text={
                  item.address
                  // item.number == 0
                  //   ? item.address
                  //   : item.number + " " + item.address
                }
              />
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={() => toRental()}>
          <MaterialIcons name="home" size={128} color={colors.blue} />
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <View>
        {/*Invitation modal*/}
        <Modal visible={invitationModal} animationType="slide">
          <View>
            <MaterialIcons
              name="close"
              size={24}
              style={{ ...styles.modalToggle, ...styles.modalClose }}
              onPress={() => {
                setCurrentInvitation();
                setInvitationModal(false);
              }}
            />
            <Text>{currentInvitation.address}</Text>
            <Text>{"Rent amount: " + currentInvitation.rentAmount}</Text>
            <Text>{"Lease start: " + currentInvitation.leaseStart}</Text>
            <Text>{"Lease term: " + currentInvitation.leaseTerm}</Text>
            <Button
              //style={styles.button}
              title="Accept"
              color="blue"
              onPress={accept}
            />
            <Button
              //style={styles.button}
              title="Reject"
              color="maroon"
              onPress={reject}
            />
            {/* <Button
              //style={styles.button}
              title="Cancel"
              color="maroon"
              onPress={() => {
                setCurrentInvitation();
                setInvitationModal(false);
              }}
            /> */}
            {/*<Options />*/}
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
          </View>
        </Modal>

        <Text style={styles.sectionTitle}>Invitations</Text>
        <FlatList
          data={invitations}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => pressInvitation(item)}>
              <Task
                text={
                  item.address
                  // item.number == 0
                  //   ? item.address
                  //   : item.number + " " + item.address
                }
              />
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity onPress={() => toRental()}>
          <MaterialIcons name="home" size={128} color={colors.blue} />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
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
});
