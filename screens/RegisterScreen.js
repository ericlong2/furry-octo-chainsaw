import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Modal,
  Button,
} from "react-native";
import { Text } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import BackButton from "../components/BackButton";
import TextInput from "../components/TextInput";

import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { passwordValidator } from "../helpers/passwordValidator";
import { nameValidator } from "../helpers/nameValidator";
import Paragraph from "../components/Paragraph";
import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";

import {createLandlord, createTenant} from "../src/graphql/mutations";

export default function RegisterScreen({ navigation }) {
  const [verification, setVerification] = useState(false); //this might need to be changed
  const [modal3Open, setModal3Open] = useState(false);

  const [name, setName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  // eslint-disable-next-line prettier/prettier

  const submitVerif = async (code) => {
    console.log(code);
    try {
      await Auth.confirmSignUp(email.value, code);
      setModal3Open(false);
      if (isEnabled) {
        
        const tmp = {};
        console.log("adding new landlord:",email.value);
        tmp.id = email.value;
        tmp.properties = [];
        tmp.name = name.value;
        const userData = await API.graphql(
          graphqlOperation(createLandlord, { input: tmp })
        );
      } else {
        const tmp = {};
        console.log("adding new tenant:",email.value);
        tmp.id = email.value;
        tmp.name = name.value;
        const userData = await API.graphql(
          graphqlOperation(createTenant, { input: tmp })
        );
      }
      navigation.navigate("Login");
    } catch (error) {
      console.log("error confirming sign up", error);
    }
    //here you can verify and close window by using
    //setModal3Open(false)
    //also your gonna need to scan if the acc has been verified or not or smt
  };

  const onSignUpPressed = async () => {
    const nameError = nameValidator(name.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError || nameError) {
      setName({ ...name, error: nameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    try {
      console.log({
        username: email.value,
        password: password.value,
        attributes: {
          email: email.value,
          name: name.value,
          "custom:landlord": isEnabled.toString(),
        },
      });
      const user = await Auth.signUp({
        username: email.value,
        password: password.value,
        attributes: {
          email: email.value,
          name: name.value,
          "custom:landlord": isEnabled.toString(),
        },
      });
      setModal3Open(true);
    } catch (error) {
      console.log("error signing up:", error);
    }
    // navigation.reset({
    //   index: 0,
    //   routes: [{ name: "Dashboard" }],
    // });
  };

  return (
    <Background>
      {/* email verification*/}
      <Modal visible={modal3Open} animationType="slide">
        <View>
          <TextInput
            style={styles.TextInput}
            placeholder="Enter the verification code sent to your email"
            onChangeText={(number) => setVerification(number)}
            //defaultValue={number}
            keyboardType="numeric"
          />
          <Button
            //style={styles.button}
            title="Submit"
            color="maroon"
            onPress={() => submitVerif(verification)}
          />
          {/*<Options />*/}
        </View>
      </Modal>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Create Account</Header>
      <TextInput
        label="Name"
        returnKeyType="next"
        value={name.value}
        onChangeText={(text) => setName({ value: text, error: "" })}
        error={!!name.error}
        errorText={name.error}
      />
      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: "" })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: "" })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.titleText}> Landlord: </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>

      <Button
        mode="contained"
        onPress={onSignUpPressed}
        style={{ marginTop: 24 }}
        title="signup"
      >
        Sign Up
      </Button>
      <View style={styles.row}>
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },

  titleText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
