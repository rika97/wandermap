import React from 'react'
import { Text, View, Button } from 'react-native'

import { StatusBar } from 'expo-status-bar';

const Landing = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
        <StatusBar />
        <Button 
            title="Register"
            onPress={() => navigation.navigate("Register")}
        />
        <Button 
            title="Login"
            onPress={() => navigation.navigate("Login")}
        />
    </View>
  )
}

export default Landing