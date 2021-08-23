import * as React from 'react';
import {FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import ContactListItem from '../components/ContactListItem';

import NewMessageButton from '../components/NewMessageButton';


import { API, graphqlOperation, Auth } from 'aws-amplify';
import {getUser, listUsers} from '../../src/graphql/queries'
import { useEffect, useState } from 'react';

export default function ContactsScreen() {

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async() => {
      try{
        const userInfo = await Auth.currentAuthenticatedUser();
        const userData = await API.graphql(graphqlOperation(getUser,{id:userInfo.attributes.email}));
        const arr = [];
        for (const userID of userData.data.getUser.contacts) {
          const contactData = await API.graphql(graphqlOperation(getUser,{id:userID}));
          arr.push(contactData.data.getUser);
        }

        setUsers(arr);
      }catch(e){
          console.log(e);
      }
    }
    
    fetchUsers();
  }, [])

  return (
    <View style={styles.container}>
        <FlatList 
          style = {{width: '100%'}}
          data = {users} 
          renderItem={({ item }) => <ContactListItem user ={item} />}
          keyExtractor={(item) => item.id}
        />
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
