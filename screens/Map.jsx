import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const dismissKeyboard = () => { if (Platform.OS != "web"){ Keyboard.dismiss(); } }

export default function Map() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation([location.coords.latitude, location.coords.longitude]);
    })();
  }, []);

  let text = 'Fetching Location...';
  if (errorMsg) {
    text = errorMsg;
  } 

  if (location === null) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View>
            <ActivityIndicator size="large" color="#30b5c7" />
        </View>
        <Text style={{ fontSize: 15, marginTop: 10, color: "#30b5c7"}}>{text}</Text>
      </View>
    )}
  return (
      <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false}>
        <View style={{ flex: 1, width: windowWidth, height: windowHeight-180 }}>
          <MapView
            style={StyleSheet.absoluteFillObject}
            provider={PROVIDER_GOOGLE}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            showsIndoors={true}
            showsIndoorLevelPicker={true}
            loadingEnabled={true}
            rotateEnabled={true}
            scrollDuringRotateOrZoomEnabled={true}
            initialRegion={{latitude: location[0], longitude: location[1], latitudeDelta: 0.09, longitudeDelta: 0.04}}
            region={{latitude: location[0], longitude: location[1], latitudeDelta: 0.09, longitudeDelta: 0.04}}
            >
            <GooglePlacesAutocomplete
              placeholder='Enter Location'
              onPress={(data, details = null) => {
                setLocation([details.geometry.location.lat, details.geometry.location.lng])
              }}
              fetchDetails
              query={{
                key: '',
                language: 'en',
              }}
              getAddressText={(input)=>console.log(input)}
              renderLeftButton={()  => <MaterialCommunityIcons name="map-marker" color='grey' size={30} style={{marginLeft: 10, marginTop: 7.5}} />}
              styles={{
                container: {
                  marginTop: 15,
                  shadowColor: '#171717',
                  shadowOffset: {width: -2, height: 4},
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                },
                textInput: {
                  height: 45,
                  marginLeft: 0,
                  marginRight: 15,
                },
                textInputContainer: {
                  backgroundColor: 'white',
                  borderRadius: 30,
                  height: 45,
                  marginLeft: 15,
                  marginRight: 15,
                },
                listView: {
                  marginLeft: 35,
                  marginRight: 35,
                }
              }}
            />
          </MapView>
          <TouchableOpacity
              style={styles.toggleButton}
              // onPress={() => this.onSignIn()}
          ><MaterialCommunityIcons name="account-group" size={26} /><Text>Friends</Text></TouchableOpacity>
      </View>
      </TouchableWithoutFeedback>
  )
}


const styles = StyleSheet.create({
  toggleButton: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 50,
    bottom: 10,
    position: "absolute",
    backgroundColor: 'white',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
})