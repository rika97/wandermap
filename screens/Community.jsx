import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

import { StatusBar } from 'expo-status-bar';

const Community = ({ navigation }) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <StatusBar />
        <Text>Community</Text>
        <Button 
            title="Search User"
            onPress={() => navigation.navigate("Search")}
        />
      </View>
    )
}

export default Community
