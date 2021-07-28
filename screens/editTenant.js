import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";
import React, { useState } from "react";
import { View, StyleSheet, TextInput, Text, Button } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  updateInvitation,
  updateProperty,
  updateTenant,
} from "../src/graphql/mutations";

function editTenant({ navigation }) {
  const tenant = navigation.getParam("tenant");
  const property = navigation.getParam("property");
  console.log(tenant);

  const removeTenant = async () => {
    try {
      console.log("removed " + tenant.name);

      property.tenants.splice(property.tenants.indexOf(tenant.id), 1);

      // update database
      await API.graphql(graphqlOperation(updateProperty, { input: property }));

      // get updated invitation list
      const invitationList = [];

      tenant.invitations.splice(tenant.invitations.indexOf(tenant.accpeted), 1);

      await API.graphql(
        graphqlOperation(deleteInvitation, {
          input: {id:tenant.accepted},
        })
      );

      tenant.accepted = null;

      // update database
      await API.graphql(graphqlOperation(updateTenant, { input: property }));

      const update = navigation.getParam("update");
      update(property);
      navigation.goBack();
      navigation.goBack();
    } catch (error) {
      console.log("error removing tenant", error);
    }
  };

  //onst email =tenant.email;
  const [leaseTerm, setLeaseTerm] = useState(tenant.leaseTerm);
  const [leaseStart, setLeaseStart] = useState(tenant.leaseStart);
  const [rentAmount, setRentAmount] = useState(tenant.rentAmount);

  const makeChanges = async () => {
    //make the changes to the tenant wiht the new stats
    try {
      const invitation = {
        id: tenant.accepted,
        propertyID: tenant.propertyID,
        leaseTerm: tenant.leaseTerm,
        leaseStart: tenant.leaseStart,
        rentAmount: tenant.rentAmount,
      };
      await API.graphql(
        graphqlOperation(updateInvitation, { input: invitation })
      );
      const refresh = navigation.getParam("refresh");
      refresh();
      navigation.goBack();
    } catch (error) {
      console.log("error updating tenant", error);
    }
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <Text>{tenant.name}</Text>
        <Text>Lease Start</Text>
        <TextInput
          style={styles.input}
          placeholder={leaseStart}
          onChangeText={(input) => setLeaseStart(input)}
        />
        <Text>Lease Term in Months</Text>
        <TextInput
          style={styles.input}
          placeholder={leaseTerm.toString()}
          onChangeText={(input) => setLeaseTerm(input)}
          keyboardType="numeric"
        />
        <Text>Monthly Rent amount</Text>
        <TextInput
          style={styles.input}
          placeholder={rentAmount.toString()}
          onChangeText={(input) => setRentAmount(input)}
          keyboardType="numeric"
        />

        <Button
          //style={styles.button}
          title="Change"
          color="maroon"
          onPress={() => makeChanges()}
        />
        <Button
          //style={styles.button}
          title={"Remove " + tenant.name}
          color="navy"
          onPress={() => removeTenant()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderRadius: 60,
    borderColor: "#C0C0C0",
    borderWidth: 1,
  },
  submit: {
    marginTop: 10,
    borderRadius: 100,
  },
});

export default editTenant;
