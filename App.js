import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import Properties from "./screens/properties";
import Navigator from "./routes/homeStack";
import GooglePlacesInput from "./screens/GooglePlacesInput";

import Amplify from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native'
import {Auth} from 'aws-amplify';
import config from './src/aws-exports';
Amplify.configure({
  ...config,
  Analytics: {
    disabled: true,
  },
});

export default function App() {
  return <Navigator />;
  //return (
  //  <View>
  //    <GooglePlacesInput />
  //  </View>
  //);
}
