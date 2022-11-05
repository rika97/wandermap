import React from 'react'
import { View } from 'react-native'
import Eventsfeed from './Eventsfeed';
import { StatusBar } from 'expo-status-bar';

const Events = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#cfe3e6' }}>
        <StatusBar />
        <Eventsfeed navigation={props.navigation}/>
    </View>
  )
};

export default Events