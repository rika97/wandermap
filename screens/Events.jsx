import React from 'react'
import { View, Button } from 'react-native'

import { StatusBar } from 'expo-status-bar';

const Events = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
        <StatusBar />
        <Button 
            title="Add Event"
            onPress={() => navigation.navigate("Editevent")}
        />
    </View>
  )
}

export default Events