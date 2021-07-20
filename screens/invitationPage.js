import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";
import { styleSheets } from "min-document";
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
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState("");

  const loadInvitations = async () => {
    if (!loaded) {
      setLoaded(true);
      try {
        // get user details
        const curUser = await Auth.currentAuthenticatedUser();
        setUser(curUser.attributes.email);
        console.log(curUser.attributes);
        // get tenant object
        const tenantData = await API.graphql({
          query: getTenant,
          variables: { id: curUser.attributes.email },
        });

        // go through list of invitations
        for (const invitation of tenantData.data.getTenant.invitations) {
          if (
            tenantData.data.getTenant.accepted != null &&
            invitation == tenantData.data.getTenant.accepted
          )
            continue;
          console.log(invitation);
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

          propertyData.data.getProperty.propertyID =
            propertyData.data.getProperty.id;
          propertyData.data.getProperty.id = invitation;

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

  const pressInvitation = (item) => {
    console.log(item);
    setCurrentInvitation(item);
    setInvitationModal(true);
  };

  const reject = () => {
    console.log("reject");
  };

  const toRental = async () => {
    try {
      // get tenant data
      const tenantData = await API.graphql({
        query: getTenant,
        variables: { id: user },
      });

      if (tenantData.data.getTenant.accepted == null) {
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
          variables: { id: tenantData.data.getTenant.accepted },
        });

        const propertyData = await API.graphql({
          query: getProperty,
          variables: { id: invitationData.data.getInvitation.propertyID },
        });
        navigation.navigate("RentalDetails", propertyData.data.getProperty);
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

      // get tenant data
      const tenantData = await API.graphql({
        query: getTenant,
        variables: { id: user },
      });

      // make sure tenant isn't already in a property
      if (tenantData.data.getTenant.accepted != null) return;

      // update tenants accepted
      tenantData.data.getTenant.accepted = currentInvitation.id;

      delete tenantData.data.getTenant.createdAt;
      delete tenantData.data.getTenant.updatedAt;

      // update in database
      await API.graphql(
        graphqlOperation(updateTenant, {
          input: tenantData.data.getTenant,
        })
      );

      // get property data
      const propertyData = await API.graphql({
        query: getProperty,
        variables: { id: currentInvitation.propertyID },
      });

      delete propertyData.data.getProperty.updatedAt;
      delete propertyData.data.getProperty.createdAt;

      propertyData.data.getProperty.tenants.push(user);
      // update in database
      await API.graphql(
        graphqlOperation(updateProperty, {
          input: propertyData.data.getProperty,
        })
      );

      //navigate to tenant page after
      navigation.navigate("RentalDetails");
    } catch (error) {
      console.log("error accepting invitation", error);
    }
  };

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
