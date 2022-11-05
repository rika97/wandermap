import React from 'react'
import { View } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import Photosfeed from './Photosfeed';
import Search from './Search';

const Community = (props) => {
  return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#cfe3e6' }}>
        <StatusBar />
        <Search uid={props.route.params.uid} navigation={props.navigation}/>
        <Photosfeed uid={props.route.params.uid} navigation={props.navigation}/>
      </View>
  )
};

export default Community