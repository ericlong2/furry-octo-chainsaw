import React, { useState } from "react";
import { ScrollView, FlatList, View, SafeAreaView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const api = "AIzaSyA-_saB2dNwnIRDgJ7_8YBWkWbaeTlfsA8";
const GooglePlacesInput = ({ addRental }) => {
  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <GooglePlacesAutocomplete 

        placeholder="Search address"
        

        minLength={2} // minimum length of text to search
        autoFocus={false}

        styles={{
          textInputContainer: {
            backgroundColor: "#989898",
            borderTopWidth: 0,
            borderBottomWidth:0
          },
          textInput: {
            marginLeft: 0,
            marginRight: 0,
            height: 40,
            backgroundColor: "#989898",
            placeholderTextColor: "red",
            fontSize: 30
          },
        }}


        //fetchDetails={true}ex
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true

          console.log(data);
          console.log("full address: " + data.description);
          console.log("house number: " + data.terms[0].value);
          console.log("street name: " + data.terms[1].value);
          console.log("City: " + data.terms[2].value);
          console.log("Province: " + data.terms[3].value);
          console.log("Country: " + data.terms[4].value);

          addRental({
            address: data.description,
            houseNumber: data.terms[0].value,
            streetName: data.terms[1].value,
            city: data.terms[2].value,
            province: data.terms[3].value,
            country: data.terms[4].value,
          });
        }}
        onFail={(error) => console.error(error)}
        query={{
          key: api,
          language: "en",
        }}
      />
    </ScrollView>
  );
};

export default GooglePlacesInput;
