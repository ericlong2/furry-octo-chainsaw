import React from "react";
import { View } from "react-native";
import { Formik } from "formik";

function TenantForm({ editTenant, tenant }) {
  return (
    <View style={StyleSheet.container}>
      <Formik
        initialValues={{
          email: tenant.email,
          leaseTerm: tenant.leaseTerm,
          leaseStart: tenant.leaseStart,
          rentAmount: tenant.rentAmount,
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
              placeholder={initialValues.email}
              onChangeText={props.handleChange("email")}
              value={props.values.email}
              //keyboardType="numeric"
            />

            <Text>Lease Term</Text>
            <TextInput
              style={styles.input}
              placeholder={initialValues.leaseTerm}
              //autoCompleteType="street-address"
              onChangeText={props.handleChange("leaseTerm")}
              value={props.values.leaseTerm}
            />

            <Text>Lease Start</Text>
            <TextInput
              style={styles.input}
              placeholder={initialValues.leaseStart}
              //autoCompleteType="street-address"
              onChangeText={props.handleChange("leaseStart")}
              value={props.values.leaseStart}
            />

            <Text>Monthly Rent</Text>
            <TextInput
              style={styles.input}
              placeholder={initialValues.rentAmount}
              //autoCompleteType="street-address"
              onChangeText={props.handleChange("rentAmount")}
              value={props.values.rentAmount}
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
