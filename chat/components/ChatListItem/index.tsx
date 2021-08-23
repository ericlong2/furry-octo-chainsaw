import moment from "moment";
import React from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import { ChatRoom } from '../../types';
import styles from './style';
import {useNavigation} from '@react-navigation/native';
import { useEffect } from "react";
import {API, graphqlOperation, Auth} from "aws-amplify";
import { useState } from "react";
import { getMessage } from "../../../src/graphql/queries";
import { onUpdateChatRoom } from "../../../src/graphql/subscriptions";

export type ChatListItemProps = {
    chatRoom: ChatRoom;

}

const ChatListItem = (props) => {
    const [chatRoom,setChatRoom] = useState(props.chatRoom);
    const [ name, setName] = useState("");
    const [lastMessage, setLastMessage] = useState({});

    const getName = async (chatRoom) => {
        try {
            const userInfo = await Auth.currentAuthenticatedUser();
            if (chatRoom.name == null) {
                var tmp = "";
                for (const user of chatRoom.chatRoomUsers) {
                    if (user != userInfo.attributes.email) {
                        tmp += user + ",";
                    }
                }
                setName(tmp.slice(0,-1));
            } else {
                setName(chatRoom.name);
            }

            if (chatRoom.lastMessageID == null) return;
            const messageData = await API.graphql(graphqlOperation(getMessage, {id:chatRoom.lastMessageID}));
            setLastMessage(messageData.data.getMessage);

        } catch (error) {
            console.log("error loading chat room",error);
        }
      //   if (chatRoom.chatRoomUsers.items[0].user.id === userInfo.attributes.email) {
      //     setOtherUser(chatRoom.chatRoomUsers.items[1].user);
      //   } else {
      //     setOtherUser(chatRoom.chatRoomUsers.items[0].user);
      //   }
      }

    useEffect(() => {
        
        getName(chatRoom);
      }, []);

      useEffect(() => {
        const subscription = API.graphql(
          graphqlOperation(onUpdateChatRoom)
        ).subscribe({
          next: (data) => {
            const newChatRoom = data.value.data.onUpdateChatRoom;
            if (newChatRoom.id !== chatRoom.id) {
              console.log("Message is in another room!")
              return;
            }
            setChatRoom(newChatRoom);
            getName(newChatRoom);
          }
        });
        return () => subscription.unsubscribe();
    }, [])
    const navigation = useNavigation();

    const onClick = () => {
        //navigate into chat room
        navigation.navigate('ChatRoom', {id: chatRoom.id, name: name})
    }
    // if(name == ""){
    //     return null;
    // }

    return(
        <TouchableWithoutFeedback onPress = {onClick}>
            <View style = {styles.container}>
                <View style = {styles.leftContainer}>
                    <Image source = {{uri: 'https://media.vanityfair.com/photos/575026f2c0f054944b554e89/master/pass/506802698.jpg'}}  style = {styles.avatar} />
                    <View style = {styles.midContainer}>
                        <Text style = {styles.userName}>{name}</Text>
                        <Text style = {styles.lastMessage}>{chatRoom.lastMessageID ? lastMessage.content : ""}</Text>
                    </View>
                </View>
                
            <Text style = {styles.time} >
                    {chatRoom.lastMessageID && moment(lastMessage.createdAt).format("DD/MM/YYYY")}
            </Text> 
            </View>
        </TouchableWithoutFeedback>

    )
};


export default ChatListItem
