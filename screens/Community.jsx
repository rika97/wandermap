import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Eventsfeed from './Eventsfeed';

export class Community extends Component {
  render() {
    return (
      <View>
        <Text>Community</Text>
        <Eventsfeed />
      </View>
    )
  }
}

export default Community
