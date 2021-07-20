import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, AppRegistry } from "react-native";
import { Text } from "react-native-paper";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import TextInput from "../components/TextInput";
import BackButton from "../components/BackButton";
import { theme } from "../core/theme";
import { emailValidator } from "../helpers/emailValidator";
import { NavigationActions } from "react-navigation";
import { passwordValidator } from "../helpers/passwordValidator";
import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";
import properties from "./properties";
import { CommonActions } from "@react-navigation/native";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    console.log("email", email.value);
    console.log("password", password.value);
    try {
      const user = await Auth.signIn(email.value, password.value);
      //////////////////////////////////WHER YOU NEED TO CHNAGE REDIRECt
      console.log(user);
      if (user.attributes["custom:landlord"] == "true") {
        console.log("signing in as landlord");

        //   navigation.dispatch(
        //     CommonActions.reset({
        //         index: 1,//the stack index
        //         routes: [
        //             { name: 'Home' },//to go to initial stack screen
        //         ],
        //     })

        // )
        navigation.reset([NavigationActions.navigate({ routeName: "Home" })]);
      } else {
        console.log("signing in as tenant");
        navigation.navigate("invitationPage");
      }
    } catch (error) {
      console.log("error signing in", error);
    }
  };

  return (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Logo />
      <Header>Welcome back.</Header>
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
      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ResetPasswordScreen")}
        >
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Login
      </Button>
      <View style={styles.row}>
        <Text>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.replace("Register")}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.text,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});
