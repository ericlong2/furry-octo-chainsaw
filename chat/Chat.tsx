import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import {withAuthenticator} from 'aws-amplify-react-native';
import Amplify, { Auth} from 'aws-amplify'
import config from './src/aws-exports'
Amplify.configure(config)

import {getUser} from './src/graphql/queries'
import {createUser} from './src/graphql/mutations'
import { API, graphqlOperation } from 'aws-amplify';

function Chat({navigation}) {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  
  //run this only the first time for linking data base
  useEffect( () => {
    const fetchUser = async () => {
      const userInfo = await Auth.currentAuthenticatedUser({ bypassCache: true });

      if (userInfo) {
        const userData = await API.graphql(
          graphqlOperation(
            getUser,
            { id: userInfo.attributes.sub }
            )
        )

        if (userData.data.getUser) {
          console.log("User is already registered in database");
          return;
        }

        const newUser = {
          id: userInfo.attributes.sub,
          name: userInfo.username,
          imageUri: 'https://media.vanityfair.com/photos/575026f2c0f054944b554e89/master/pass/506802698.jpg',
          status: 'Hey, I am using WhatsApp',
        }

        await API.graphql(
          graphqlOperation(
            createUser,
            { input: newUser }
          )
        )
      }
    }

    fetchUser();
  }, [])


  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

export default  withAuthenticator(Chat)

function effect(effect: any, arg1: () => any) {
  throw new Error('Function not implemented.');
}
function params(params: any, arg1: { bypassCache: boolean; }) {
  throw new Error('Function not implemented.');
}

