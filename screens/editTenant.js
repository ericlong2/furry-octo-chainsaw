import React, { useState } from "react";
import { View, StyleSheet, TextInput, Text } from "react-native";

function editTenant({ navigation }) {
  const [loaded, setLoaded] = useState(false);
  const [tenant, setTenant] = useState({});

  const loadTenant = async() => {
    if (!loaded) {
      setLoaded(true);
      try {
        // get user details
        const curUser = await Auth.currentAuthenticatedUser();
        //setUser(curUser.attributes.email);
        console.log(curUser.attributes);

        // get tenant object
        const tenantData = await API.graphql({
          query: getTenant,
          variables: { id: curUser.attributes.email },
        });

        const invitationData = await API.graphql({
          query: getInvitation,
          variables: { id: tenantData.data.getTenant.accepted},
        });

        tenantData.data.getTenant.leaseTerm = invitationData.data.getInvitation.leaseTerm;
        tenantData.data.getTenant.leaseStart = invitationData.data.getInvitation.leaseStart;
        tenantData.data.getTenant.rentAmount = invitationData.data.getInvitation.rentAmount;
        setTenant(tenantData.data.getTenant);
      } catch (error) {
        console.log("error loading tenant",error);
      }
    } 
  }
  loadTenant();

  
  //onst email =tenant.email;
  const [leaseTerm, setLeaseTerm] = useState(tenant.leaseTerm);
  const [leaseStart, setLeaseStart] = useState(tenant.leaseStart);
  const [rentAmount, setRentAmount] = useState(tenant.rentAmount);

  const makeChanges = () => {
    //make the changes to the tenant wiht the new stats

    navigation.goBack();
  };

  return (
    <View>
      <Text>{tenant.name}</Text>
      <Text>Lease Start</Text>
      <TextInput
        style={styles.input}
        placeholder={leaseStart}
        onChangeText={(input = setLeaseStart(input))}
      />
      <Text>Lease Term in Months</Text>
      <TextInput
        style={styles.input}
        placeholder={leaseTerm}
        onChangeText={(input = setLeaseTerm(input))}
        keyboardType="numeric"
      />
      <Text>Monthly Rent amount</Text>
      <TextInput
        style={styles.input}
        placeholder={rentAmount}
        onChangeText={(input = setRentAmount(input))}
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
