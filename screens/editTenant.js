import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";
import React, { useState } from "react";
import { View, StyleSheet, TextInput, Text, Button } from "react-native";
import { updateInvitation } from "../src/graphql/mutations";

function editTenant({ navigation }) {
  const tenant = navigation.getParam("tenant");
  console.log(tenant);
  
  //onst email =tenant.email;
  const [leaseTerm, setLeaseTerm] = useState(tenant.leaseTerm);
  const [leaseStart, setLeaseStart] = useState(tenant.leaseStart);
  const [rentAmount, setRentAmount] = useState(tenant.rentAmount);

  const makeChanges = async() => {
    //make the changes to the tenant wiht the new stats
    try {
      const invitation = {id:tenant.accepted,propertyID:tenant.propertyID,leaseTerm:tenant.leaseTerm,leaseStart:tenant.leaseStart,rentAmount:tenant.rentAmount};
      await API.graphql(
        graphqlOperation(updateInvitation, { input: invitation })
      );
      navigation.goBack();
    } catch (error) {
      console.log("error updating tenant", error);
    }
  };

  return (
    <View>
      <Text>{tenant.name}</Text>
      <Text>Lease Start</Text>
      <TextInput
        style={styles.input}
        placeholder={leaseStart}
        onChangeText={(input => setLeaseStart(input))}
      />
      <Text>Lease Term in Months</Text>
      <TextInput
        style={styles.input}
        placeholder={leaseTerm}
        onChangeText={(input => setLeaseTerm(input))}
        keyboardType="numeric"
      />
      <Text>Monthly Rent amount</Text>
      <TextInput
        style={styles.input}
        placeholder={rentAmount}
        onChangeText={(input => setRentAmount(input))}
        keyboardType="numeric"
      />

      <Button
        //style={styles.button}
        title="Change"
        color="maroon"
        onPress={() => makeChanges()}
      />
    </View>
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
