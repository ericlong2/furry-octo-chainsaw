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

export default function App() {
  return <Navigator />;
}
