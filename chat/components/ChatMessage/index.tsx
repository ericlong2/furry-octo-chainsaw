import moment from "moment";
import React from "react";
import { Text, View,KeyboardAvoidingView, Platform } from "react-native"
import { Message } from "../../types";
import styles from "../ChatMessage/styles";

export type ChatMessageProps = {
    message: Message;
    myId: String,


}
const chatMessage = (props: ChatMessageProps) => {
    const { message, myId } = props; 

    const isMyMessage = () => {
        //determine if my message or not
        return message.userID === myId;
    }

    return (

        <View style ={styles.container}> 
            <View style = {[
                styles.messageBox,{
                    backgroundColor: isMyMessage() ? '#DCF8c5' : 'white',
                    marginLeft : isMyMessage() ? 50 : 0,
                    marginRight : isMyMessage() ? 0 : 50,
                }  
            ]}>
                {/* if it is my message then display the username */}
                {!isMyMessage() && <Text style = {styles.name}>{message.userName}</Text>}
                <Text style = {styles.message} >{message.content}</Text>
                <Text style = {styles.time}>{moment(message.createdAt).fromNow()}</Text>
            </View>
        </View>
        
    )
}

export default chatMessage;