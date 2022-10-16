import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import Search from './Search';

import { StatusBar } from 'expo-status-bar';
const dismissKeyboard = () => { if (Platform.OS != "web"){ Keyboard.dismiss(); } }

const Community = ({ navigation }) => {
    return (
      <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <StatusBar />
          <Text style={{fontSize: 20}}>Community</Text>
          <Search navigation={navigation}/>
        </View>
      </TouchableWithoutFeedback>
      
    )
}

export default Community
