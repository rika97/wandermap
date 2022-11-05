import React, { useState } from 'react';
import { View, TouchableWithoutFeedback, Keyboard, Text, Dimensions, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const dismissKeyboard = () => { if (Platform.OS != "web"){ Keyboard.dismiss(); } }
const windowHeight = Dimensions.get('window').height;

const Createevent = ( props ) => {
  const [location, setLocation] = useState("");
  const [locationCoords, setLocationCoords] = useState("");

  const name = props.route.params.user.name;

  return (
    <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false}>
        <View style={StyleSheet.absoluteFillObject}>
          <Text style={{fontSize: 25, fontWeight: "bold", alignSelf: "center", marginTop: windowHeight/4, marginBottom: 20}}>Enter Location:</Text>
          <GooglePlacesAutocomplete
                placeholder='Enter Location'
                onPress={(data, details = null) => {
                  setLocation(data.description)
                  setLocationCoords([details.geometry.location.lat, details.geometry.location.lng])
                }}
                fetchDetails
                query={{
                  key: '',
                  language: 'en',
                }}
                styles={styles.searchBar}
              />
          <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if (location == "") {
                  setErrorMsg("You must enter a location.")
                } else {
                  props.navigation.navigate('Addevent', { location, locationCoords, name })
                }
              }}
          ><Text style={{color: 'white'}}>Next</Text></TouchableOpacity>
        </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
    button: {
      alignSelf: "center",
      alignItems: 'center',
      backgroundColor: "#30b5c7",
      padding: 10,
      borderRadius: 30,
      width: 250,
      height: 45,
      justifyContent: 'center',
      marginBottom: 130,
    },
    searchBar: {
      container: {
        marginTop: 10,
      },
      textInput: {
        height: 45,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 0,
        backgroundColor: 'white',
      },
      textInputContainer: {
        backgroundColor: 'white',
        borderRadius: 30,
        height: 50,
        marginLeft: 15,
        marginRight: 15,
        borderWidth: 1,
        borderColor: 'white',
      },
      listView: {
        marginLeft: 35,
        marginRight: 35,
      }
    },
  });

export default Createevent;