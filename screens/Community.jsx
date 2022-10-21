import React from 'react'
import { View } from 'react-native'
import Photosfeed from './Photosfeed';
import Search from './Search';

import { StatusBar } from 'expo-status-bar';

const Community = (props) => {
  return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <StatusBar />
        <Search navigation={props.navigation}/>
        <Photosfeed uid={props.route.params.uid} navigation={props.navigation}/>
      </View>
  )
};

export default Community