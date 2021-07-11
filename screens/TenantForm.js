import React from "react";
import { TextInput, View } from "react-native";
import { Formik } from "formik";

function TenantForm({ editTenant }) {
  return (
    <View style={StyleSheet.container}>
      <Formik
        initialValues={{
          email: "",
          leaseTerm: 0,
          leaseStart: "",
          rentAmount: 0,
        }}
        onSubmit={(values, actions) => {
          console.log(values); //this can be taken out later
          actions.resetForm();
          editTenant(values);
        }}
      >
        {(props) => (
          <View>
            <Text>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              onChangeText={props.handleChange("email")}
              value={props.values.email}
              //keyboardType="numeric"
            />

            <Text>Lease Term</Text>
            <TextInput
              style={styles.input}
              placeholder="Lease term in months"
              //autoCompleteType="street-address"
              onChangeText={props.handleChange("leaseTerm")}
              value={props.values.leaseTerm}
              keyboardType="numeric"
            />

            <Text>Lease Start Date</Text>
            <TextInput
              style={styles.input}
              placeholder="lease terms start date"
              //autoCompleteType="street-address"
              onChangeText={props.handleChange("leaseStart")}
              value={props.values.leaseStart}
            />

            <Text>Monthly Rent</Text>
            <TextInput
              style={styles.input}
              placeholder="monthly rent amount"
              //autoCompleteType="street-address"
              onChangeText={props.handleChange("rentAmount")}
              value={props.values.rentAmount}
              keyboardType="numeric"
            />

            <Button
              style={styles.submit}
              title="submit"
              color="maroon"
              onPress={props.handleSubmit}
            />
          </View>
        )}
      </Formik>
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

export default TenantForm;
