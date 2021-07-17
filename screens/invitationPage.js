import { API } from "aws-amplify";
import { styleSheets } from "min-document";
import React, { useState } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  StyleSheet,
  MaterialIcons,
  Alert,
  Modal,
  Button,
  Text,
} from "react-native";
import Task from "../components/Task";
import colors from "./Colors";
import { updateTenant } from "../src/graphql/mutations";
import { getInvitation, getProperty, getTenant } from "../src/graphql/queries";

function invitationPage({ navigation }) {
  const [invitations, setInvitations] = useState([]);
  const [invitationModal, setInvitationModal] = useState(false);
  const [currentInvitation, setCurrentInvitation] = useState();
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState("");

  const loadInvitations = async() => {
    if (!loaded) {
      setLoaded(true);
      try {

        // get user details
        const curUser = await Auth.currentAuthenticatedUser();
        setUser(curUser.attributes.email);


        // get tenant object
        const tenantData = await API.graphql({
          query: getTenant,
          variables: { id: curUser.attributes.email },
        });


        // go through list of invitations
        for (const invitation of tenantData.data.getTenant.invitations) {

          // get invitation object
          const invitationData = await API.graphql({
            query: getInvitation,
            variables: { id: invitation} ,
          });


          // get corresponding property
          const propertyData = await API.graphql({
            query: getProperty,
            variables: { id : invitationData.propertyID},
          });

          propertyData.data.getProperty.id = invitation;


          // add to invitation list
          setInvitations((currentInvitations) => {
            return [propertyData.data.getProperty, ...currentInvitations];
          });
        }
      } catch (error) {
        console.log("error loading invitations",error);
      }
    }
  }

  loadInvitations();

  const pressInvitation = (item) => {
    console.log(item);
    setCurrentInvitation(item);
  };

  const toRental = async() => {
    
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
        navigation.navigate("Tenant");
      }
    } catch (error) {
      console.log("error checking if tenant accepted an invitation", error);
    }
  };

  const accept = async() => {
    // if no invitation selected, do nothing
    if (currentInvitation == null ) return;
    try {
        console.log("accept");
        console.log(item);

        // get tenant data
        const tenantData = await API.graphql({
          query: getTenant,
          variables: { id: curUser.attributes.email },
        });

        // make sure tenant isn't already in a property
        if (tenantData.data.getTenant.accepted != null) return;

        // update tenants accepted
        tenantData.data.getTenant.accepted = currentInvitation.id;

        // update in database
        await API.graphql(
          graphqlOperation(updateTenant, {
            input: tenantData.data.getTenant,
          })
        );
        
        //navigate to tenant page after
        navigation.navigate("Tenant");
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
            color="maroon"
            onPress={accept}
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
                item.number == 0
                  ? item.address
                  : item.number + " " + item.address
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

export default invitationPage;
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
