import React, { useState } from "react";
import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import { Formik } from "formik";

export default function AddForm({ addRental }) {
  return (
    <View style={StyleSheet.container}>
      <Formik
        initialValues={{
          number: 0,
          address: "",
          city: "",
        }}
        onSubmit={(values, actions) => {
          console.log(values); //this can be taken out later
          actions.resetForm();
          addRental(values);
        }}
      >
        {(props) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Apt number"
              onChangeText={props.handleChange("number")}
              value={props.values.number}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Address"
              onChangeText={props.handleChange("address")}
              value={props.values.address}
            />

            <TextInput
              style={styles.input}
              placeholder="Address City"
              onChangeText={props.handleChange("city")}
              value={props.values.city}
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