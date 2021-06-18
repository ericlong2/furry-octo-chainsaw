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
function App() {
  return <Navigator />;
}
export default withAuthenticator(App)

