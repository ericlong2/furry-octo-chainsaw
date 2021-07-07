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
<<<<<<< Updated upstream
=======
import GooglePlacesInput from "./screens/GooglePlacesInput";
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
function App() {
=======
export default function App() {
>>>>>>> Stashed changes
  return <Navigator />;
}
export default withAuthenticator(App)

