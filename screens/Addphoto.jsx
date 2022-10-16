import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { TextInput } from 'react-native-paper';

const Addphoto = (props) => {
  const image = props.route.params.uri;

  return (
      <View>
        {image && <Image source={{uri: image}} style={{flex:1}} />}
      </View>
  )
};

const styles = StyleSheet.create({
});

export default Addphoto