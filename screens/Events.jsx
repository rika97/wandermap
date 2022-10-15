import React from 'react'
import { View, Button, Text } from 'react-native'
import Eventsfeed from './Eventsfeed';

import { StatusBar } from 'expo-status-bar';

const Events = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
        <StatusBar />
        <Button 
            title="Add Event"
            onPress={() => navigation.navigate("Editevent")}
        />
        <Text>Upcoming Events:</Text>
        <Eventsfeed />
    </View>
  )
}

export default Events