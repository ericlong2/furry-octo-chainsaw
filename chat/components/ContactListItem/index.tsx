import moment from "moment";
import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { User } from '../../types';
import styles from './styles';
import {useNavigation} from '@react-navigation/native';

import {API, graphqlOperation, Auth} from "aws-amplify";
import {createChatRoom, createChatRoomUser, updateUser } from '../../../src/graphql/mutations'
import { useState } from "react";
import { getUser } from "../../../src/graphql/queries";


export type ContactListItemProps = {
    user: User;

}


const ContactListItem = (props: ContactListItemProps) => {
    const {user} = props;
    
    const navigation = useNavigation();

    const generateID = () => {
      return Math.random().toString();
    }
    
    const onClick = async () => {
        try {
    
          const userInfo = await Auth.currentAuthenticatedUser();

          //  1. Create a new Chat Room
          const newChatRoomData = await API.graphql(
            graphqlOperation(
              createChatRoom, {
                input: {
                  id: generateID(),
                  chatRoomUsers: [userInfo.attributes.email,user.id],
                  messages: [],
                }
              }
            )
          )
              
          if (!newChatRoomData.data) {
            console.log(" Failed to create a chat room");
            return;
          }
          
          const newChatRoom = newChatRoomData.data.createChatRoom;

          const userData = await API.graphql(graphqlOperation(getUser,{id:userInfo.attributes.email}));
          userData.data.getUser.chatRooms.push(newChatRoom.id);
          delete userData.data.getUser.createdAt;
          delete userData.data.getUser.updatedAt;
          await API.graphql(graphqlOperation(updateUser,{input:userData.data.getUser}));

          const userData2 = await API.graphql(graphqlOperation(getUser,{id:user.id}));
          userData2.data.getUser.chatRooms.push(newChatRoom.id);
          delete userData2.data.getUser.createdAt;
          delete userData2.data.getUser.updatedAt;
          await API.graphql(graphqlOperation(updateUser,{input:userData2.data.getUser}));

          navigation.navigate('ChatRoom', {id: newChatRoom.id, name: user.id})
    
        } catch (e) {
          console.log(e);
        }
      }

    return(
        <TouchableWithoutFeedback onPress = {onClick}>
            <View style = {styles.container}>
                <View style = {styles.leftContainer}>
                    <Image source = {{uri: user.imageUri}}  style = {styles.avatar} />
                    <View style = {styles.midContainer}>
                        <Text style = {styles.userName}>{user.name}</Text>
                        <Text numberOfLines={2} style={styles.status}>{user.status}</Text>
                    </View>
                </View>

            </View>
        </TouchableWithoutFeedback>

    )
};


export default ContactListItem
