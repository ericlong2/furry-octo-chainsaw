import React, {useState} from "react";
import Background from "../components/Background";
import Logo from "../components/Logo";
import Header from "../components/Header";
import Button from "../components/Button";
import Paragraph from "../components/Paragraph";
import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";


export default function StartScreen({ navigation }) {
  const [loaded, setLoaded] = useState(false);
  const loadUser = async() => {
    if (!loaded) {
      setLoaded(true);
      try {
        const user = Auth.currentAuthenticatedUser();
        if (user.attributes["custom:landlord"] == "true") {
          console.log("signing in as landlord");

          navigation.navigate("Home");
        } else {
          console.log("signing in as tenant");
          navigation.navigate("invitationPage");
        }
      } catch (error) {
        console.log("user is not logged in");
      }
    }
  }
  loadUser();
  return (
    <Background>
      <Logo />
      <Header>APEX AFFINITY</Header>
      <Button mode="contained" onPress={() => navigation.navigate("Login")}>
        Login
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate("Register")}>
        Sign Up
      </Button>
    </Background>
  );
}
