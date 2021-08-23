import { Entypo, MaterialCommunityIcons, FontAwesome5, Fontisto } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import styles from './styles'

import {
    API,
    Auth,
    graphqlOperation,
} from 'aws-amplify'

import {createMessage, updateChatRoom } from '../../../src/graphql/mutations'
import { useEffect } from "react";

const InputBox = (props) => {

    const chatRoom = props.chatRoomID;
    const [message, setMessage] = useState('');

    const [user, setUser] = useState({});

    useEffect(() =>{
        const fetchUser = async () =>{
            const userInfo = await Auth.currentAuthenticatedUser();
            setUser(userInfo.attributes);

        }   
        fetchUser();
    },[])


    const onMicrophonePress = () =>{
        console.log("microphone pressed")
    }

    const updateChatRoomLastMesage = async (messageId: string) => {
        try{
            chatRoom.messages.push(messageId);
            await API.graphql(
                graphqlOperation(
                    updateChatRoom,{
                        input: {
                            id: chatRoom.id,
                            name: chatRoom.name,
                            chatRoomUsers: chatRoom.chatRoomUsers,
                            messages: chatRoom.messages,
                            lastMessageID: messageId,
                        }
                    }
                )
            )
        }catch(e){  
            console.log(e);
        }
    }
    

    const generateID = () => {
        return Math.random().toString();
    }

    const onSendPress = async () =>{


        try{
            const newMessageData = await API.graphql(
                graphqlOperation(
                    createMessage, {
                        input: {
                            id: generateID(),
                            content: message,
                            userID: user.email,
                            userName: user.name,
                            chatRoomID: chatRoom.id
                        }
                    }
                )
            )
            
           await updateChatRoomLastMesage(newMessageData.data.createMessage.id)
        }catch(e){
            console.log(e);
        }
        setMessage(' ');
        
        //send message to backend
    }

    const onPress =  () => {
        if(!message){
            onMicrophonePress();
        }else{
            onSendPress();
        }
    }



    return (
     <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={98}
        style={styles.container}
      >
                <View style = {styles.mainContainer}>
                    <FontAwesome5 name = "laugh-beam" size = {24} color = "grey"/>

                    <TextInput style = {styles.textInput}  
                        placeholder = "Type a message"
                        multiline 
                        value = {message}
                        onChangeText  = {setMessage}
                    />

                    <Entypo name = "attachment" size = {24} color = "grey" style = {styles.icon}/>

                    {
                        !message ? 
                        <Fontisto name = "camera" size = {24} color = "grey" style = {styles.icon} />:
                        null
                    }
                    

                </View>
                    

                <View style = {styles.buttonContainer}>
                    <TouchableOpacity onPress = {onPress}>
                        {
                            !message ? 
                            <MaterialCommunityIcons name = "microphone" size = {28} color = "white"/> : 
                            <MaterialCommunityIcons name = "send" size = {28} color = "white" />
                        }
                    </TouchableOpacity>
                    
                        
                </View> 
     </KeyboardAvoidingView>
    )
}


export default InputBox