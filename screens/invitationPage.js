import { styleSheets } from "min-document";
import React, { useState } from "react";
import { FlatList, View, TouchableOpacity, StyleSheet } from "react-native";
import Task from "../components/Task";

function invitationPage({ navigation }) {
  const [invitations, setInvitations] = useState([]);
  const [invitationModal, setInvitationModal] = useState(false);
  const [currentInvitation, setCurrentInvitation] = useState();

  const pressInvitation = (item) => {
    console.log(item);
    setCurrentInvitation(item);
  };

  const accept = () => {
    console.log("accept");
    console.log(item);
    //navigate to tenant page after
    navigation.navigate("Tenant");
  };

  return (
    <View>
      {/*Invitation modal*/}
      <Modal visible={invitationModal} animationType="slide">
        <View>
          <MaterialIcons
            name="close"
            size={24}
            style={{ ...styles.modalToggle, ...styles.modalClose }}
            onPress={() => {
              setCurrentInvitation();
              setInvitationModal(false);
            }}
          />
          <Button
            //style={styles.button}
            title="Accept"
            color="maroon"
            onPress={accept}
          />
          {/* <Button
            //style={styles.button}
            title="Cancel"
            color="maroon"
            onPress={() => {
              setCurrentInvitation();
              setInvitationModal(false);
            }}
          /> */}
          {/*<Options />*/}
        </View>
      </Modal>

      <Text style={styles.sectionTitle}>Invitations</Text>
      <FlatList
        data={invitations}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => pressInvitation(item)}>
            <Task
              text={
                item.number == 0
                  ? item.address
                  : item.number + " " + item.address
              }
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

export default invitationPage;
const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
