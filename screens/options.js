import React from "react";

import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Button,
} from "react-native";

function options() {
  return (
    <View style={styles.container}>
      <Text>Hello</Text>
      <Button
        //style={styles.button}
        title="Logout"
        color="maroon"
        onPress={() => console.log("logout")}
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

export default options;
