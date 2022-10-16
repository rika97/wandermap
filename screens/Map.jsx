import React from 'react';
import { View, Text, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';

const windowHeight = Dimensions.get('window').height;
const dismissKeyboard = () => { if (Platform.OS != "web"){ Keyboard.dismiss(); } }

export default function Map() {
  return (
    <KeyboardAwareScrollView 
                    style={{
                        flex: 1,
                        backgroundColor: 'white'
                    }}
                    extraScrollHeight={100}
                    >
      <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false}>
        <View style={{ flex: 1, marginTop: -6 }}>
            <TextInput
              placeholder="Enter Location"
              // onChangeText={ (search)=>{
              //   fetchUsers(search);
              //   setSearchValue(search);
              // } }
              mode="outlined"
              // value={searchValue}
              right={<TextInput.Icon icon="close-circle"
              //   onPress={() => {
              //   setSearchValue("");
              //   setUsers([]);
              // }}
              />}
            />
            <MapView
              style={{height: windowHeight-280, marginTop: 50}}
              provider={PROVIDER_GOOGLE}
              showsUserLocation={true}
              followsUserLocation={true}
              showsMyLocationButton={true}
              loadingEnabled
            />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  )
}
