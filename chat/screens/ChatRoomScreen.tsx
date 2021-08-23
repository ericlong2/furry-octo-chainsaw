import React, {useEffect, useState} from 'react';
import {FlatList, Text, ImageBackground, KeyboardAvoidingView } from 'react-native';

import { Route, useRoute } from '@react-navigation/native';
import {
  API,
  graphqlOperation,
  Auth,
} from 'aws-amplify';

import { onCreateMessage } from '../../src/graphql/subscriptions';


import ChatMessage from "../components/ChatMessage";
import BG from '../assets/images/bg.jpg';
import InputBox from "../components/InputBox";
import { Platform } from 'react-native';
import { getChatRoom, getMessage } from '../../src/graphql/queries';
import { ChatRoom } from '../types';

const ChatRoomScreen = () => {

  const [messages, setMessages] = useState([]);
  const [myId, setMyId] = useState(null);
  const [chatRoom, setChatRoom] = useState({});
  const route = useRoute();

  const fetchMessages = async () => {
    const arr = [];
    const chatRoomData = await API.graphql(graphqlOperation(getChatRoom, {id: route.params.id}));
    for (const messageID of chatRoomData.data.getChatRoom.messages) {
      const messageData = await API.graphql(graphqlOperation(getMessage, {id: messageID}));
      arr.push(messageData.data.getMessage);
    }
    setChatRoom(chatRoomData.data.getChatRoom);
    console.log("FETCH MESSAGES")
    arr.reverse();
    setMessages(arr);
  }

  useEffect(() => {
    fetchMessages();
  }, [])

  useEffect(() => {
    const getMyId = async () => {
      const userInfo = await Auth.currentAuthenticatedUser();
      setMyId(userInfo.attributes.email);
    }
    getMyId();
  }, [])

  useEffect(() => {
    const subscription = API.graphql(
      graphqlOperation(onCreateMessage)
    ).subscribe({
      next: (data) => {
        const newMessage = data.value.data.onCreateMessage;

        if (newMessage.chatRoomID !== route.params.id) {
          console.log("Message is in another room!")
          return;
        }
        fetchMessages();
        // setMessages([newMessage, ...messages]);
      }
    });

    return () => subscription.unsubscribe();
  }, [])

  console.log(`messages in state: ${messages.length}`)
  return (
    <ImageBackground style={{width: '100%', height: '100%'}} source={BG}>

      <FlatList
        data={messages}
        renderItem={({ item }) => <ChatMessage myId={myId} message={item} />}
        inverted
      />

      <InputBox chatRoomID={chatRoom} />
    </ImageBackground>
  );
}

export default ChatRoomScreen;