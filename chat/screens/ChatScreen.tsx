import * as React from 'react';
import {FlatList, KeyboardAvoidingView, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import ChatListItem from '../components/ChatListItem';
import NewMessageButton from '../components/NewMessageButton';
import { useEffect } from 'react';
import {API, graphqlOperation, Auth} from 'aws-amplify';
import { UserInterfaceIdiom } from 'expo-constants';
import { ConsoleLogger } from '@aws-amplify/core';
import { useState } from 'react';
import { getChatRoom, getUser } from '../../src/graphql/queries';
import { onUpdateUser } from '../../src/graphql/subscriptions';

export default function ChatScreen() {

  const [chatRooms, setChatRooms] = useState([]);

  const fetchChatRooms = async () =>{
    try{
      console.log("fetching chat rooms");
      const userInfo = await Auth.currentAuthenticatedUser();

      const userData = await API.graphql(
        graphqlOperation(
          getUser,{
            id: userInfo.attributes.email,

          }
        )
      )
      
      if (userData.data.getUser.chatRooms==null) {
        return;
      }
      const arr = [];
      for (const chatRoomID of userData.data.getUser.chatRooms) {
        const chatRoomData = await API.graphql(graphqlOperation(getChatRoom,{id:chatRoomID}));
        arr.push(chatRoomData.data.getChatRoom);
      }
      setChatRooms(arr);

      
    }catch(e){
      console.log(e);
    }
  }

  useEffect( () =>{
    
    fetchChatRooms();

  },[])

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onUpdateUser)
    ).subscribe({
      next: async(data) => {
        const userInfo = await Auth.currentAuthenticatedUser();
        const newUser = data.value.data.onUpdateUser;

        if (newUser.id !== userInfo.attributes.email) {
          console.log("Message is in another room!")
          return;
        }
        fetchChatRooms();
        // setMessages([newMessage, ...messages]);
      }
    });

    return () => subscription.unsubscribe();
  }, [])
  console.log(chatRooms);
  return (

      <View style={styles.container}>
          <FlatList 
            style = {{width: '100%'}}
            data = {chatRooms} 
            renderItem={({ item }) => <ChatListItem chatRoom={item} />}
            keyExtractor={(item) => item.id}
          />

          <NewMessageButton />
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
