import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function rentalPage({ navigation }) {
  return (
    <View style={StyleSheet.container}>
      <Text>Rental page, needs to be dynamic</Text>
      <Text>{navigation.getParam("number")} {navigation.getParam("address")}</Text>
      <Text>{navigation.getParam("city")}</Text>
      <Text>{navigation.getParam("issues")}</Text>
      <Text>{navigation.getParam("key")}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EAED",
  },
});
