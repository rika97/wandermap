import React from 'react'
import { View, Text } from 'react-native'
import Eventsfeed from './Eventsfeed';

import { StatusBar } from 'expo-status-bar';

const Events = (props) => {
  console.log("Events", props)
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
        <StatusBar />
        <Text style={{fontSize: 20}}>Upcoming Events</Text>
        <Eventsfeed navigation={props.navigation}/>
    </View>
  )
};

export default Events