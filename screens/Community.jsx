import React, { Component } from 'react';
import { Text, View, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Search from './Search';

import { StatusBar } from 'expo-status-bar';

const Community = ({ navigation }) => {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <StatusBar />
          <Text style={{fontSize: 20}}>Community</Text>
          <Search navigation={navigation}/>
        </View>
      </TouchableWithoutFeedback>
      
    )
}

export default Community
