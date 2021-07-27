import React, { useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  Button,
} from "react-native";

import { MaterialIcons } from "@expo/vector-icons";

import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";

import colors from "./Colors";
export default function Tenant({ navigation }) {
  const [modalMenuOpen, setModalMenuOpen] = useState(false);

  const tenant = navigation.getParam("tenant");
  const property = navigation.getParam("property");
  async function signOut() {
    try {
      await Auth.signOut();
      navigation.reset([NavigationActions.navigate({ routeName: "Start" })]);
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }
  function refresh() {
    setLoaded(false);
    loadTenant();
  }

  const editTenant = async () => {
    try {

      // check if user is landlord
      if (navigation.getParam("custom:landlord") == "true") {
        //open modal to edit the tenant and save the information
        navigation.navigate("editTenant", { tenant: tenant, property: property, update: navigation.getParam("update"), });
      }
    } catch (error) {
      console.log("error editing tenant", error);
    }
  };
  return (
    <View>
      <Text>{tenant.name}</Text>

      <Text>{"Lease Start: " + tenant.leaseStart}</Text>
      <Text>{"Lease Term: " + tenant.leaseTerm}</Text>
      <Text>{"Rent Amount: " + tenant.rentAmount}</Text>
      {/*menu options*/}
      <Modal visible={modalMenuOpen} animationType="slide">
        <View>
          <MaterialIcons
            name="close"
            size={24}
            style={{ ...styles.modalToggle, ...styles.modalClose }}
            onPress={() => setModalMenuOpen(false)}
          />
          <Button
            //style={styles.button}
            title="Edit Tenant Info"
            color="yellow"
            onPress={() => editTenant()}
          />
          <Button
            //style={styles.button}
            title="Logout"
            color="maroon"
            onPress={signOut}
          />
          <Button
            //style={styles.button}
            title="Refresh"
            color="blue"
            onPress={refresh}
          />
          {/*<Options />*/}
        </View>
      </Modal>
      <MaterialIcons
        name="menu-open"
        size={24}
        style={styles.modalMenuToggle}
        onPress={() => setModalMenuOpen(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "flex-start",
  },
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },
  divider: {
    backgroundColor: colors.lightBlue,
    height: 1,
    width: 1,
    flex: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 64,
  },
  modalMenuToggle: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "baseline",
  },
  Plus: {
    borderWidth: 2,
    borderColor: colors.blue,
    borderRadius: 4,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    marginLeft: 5,
    color: colors.black,
  },
});
