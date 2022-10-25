import React from 'react'
import { View, Text } from 'react-native'
import Eventsfeed from './Eventsfeed';

import { StatusBar } from 'expo-status-bar';

const Events = (props) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
        <StatusBar />
        <Eventsfeed navigation={props.navigation}/>
    </View>
  )
};

export default Events