import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import UserAvatar from "react-native-user-avatar";
export default class PeopleList extends Component {
  render() {
    return (
      <View style={{ paddingHorizontal: 7 }}>
        <UserAvatar
          size={80}
          name={this.props.person.name}
          style={styles.avatar}
          borderRadius={6}
        />
      </View>
    );
  }
}
{
  /* add onPress component and link with react navigation to touchable opacity*/
}
{
  /* add image src= {image_url or path?} */
}
const styles = StyleSheet.create({
  avatar: {
    paddingHorizontal: 12,
  },
});
