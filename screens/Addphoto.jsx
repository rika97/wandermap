import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Dimensions, TextInput } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import firebase from 'firebase/app'
require("firebase/firestore")

const api_key = ''

const dismissKeyboard = () => { if (Platform.OS != "web"){ Keyboard.dismiss(); } }

const Addphoto = (props) => {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [locationCoords, setLocationCoords] = useState("");

  const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;

  const uploadImage = async () => {
    const uri = props.route.params.image;

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob)

    const taskProgress = snapshot => {
        setLoading(true)
        console.log(`transferred: ${snapshot.bytesTransferred}`)
    }

    const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot)=>{
            savePhotoData(snapshot)
        })
    }

    const taskError = snapshot => {
        console.log(snapshot)
    }

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  };

  const savePhotoData = (downloadURL) => {
    firebase.firestore()
        .collection('photos')
        .doc(firebase.auth().currentUser.uid)
        .collection("userPhotos")
        .add({
            downloadURL,
            caption,
            location,
            locationCoords,
            creator: props.route.params.user.name,
            creation: firebase.firestore.FieldValue.serverTimestamp()
        }).then((function(){
            console.log('task completed')
            props.navigation.navigate("Account")
        }))
  }

  return (
      <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false}>
        { loading ? 
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View>
                    <ActivityIndicator size="large" color="#30b5c7" />
                </View>
                <Text style={{ fontSize: 15, marginTop: 10, color: "#30b5c7"}}>Uploading Photo...</Text>
            </View>:
            <View style={StyleSheet.absoluteFillObject}>
              <View style={styles.container}>
                <Text style={styles.header}>Caption:</Text>
                <TextInput 
                    placeholder='Enter caption'
                    mode='outlined'
                    onChangeText={(caption) => setCaption(caption)}
                    style={styles.textInput}
                />
              </View>
              <Text style={styles.header}>Location:</Text>
              <GooglePlacesAutocomplete
                placeholder='Enter Location'
                onPress={(data, details = null) => {
                  setLocation(data.description)
                  setLocationCoords([details.geometry.location.lat, details.geometry.location.lng])
                }}
                fetchDetails
                query={{
                  key: api_key,
                  language: 'en',
                }}
                styles={styles.searchBar}
              />
              <TouchableOpacity
                  style={styles.button}
                  onPress={() => {uploadImage()}}
              ><Text style={{color: 'white'}}>Post Photo</Text></TouchableOpacity>
            </View>
        }
    </TouchableWithoutFeedback>
  )
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
  header: {
    fontSize: 16,
    fontWeight: "bold",
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 30,
    marginTop: 10,
  },
  textInput: {
    marginTop: 5,
    backgroundColor: "white",
    borderRadius: 30,
    fontSize: 16,
    padding: 10,
    marginHorizontal: 15,
    height: 45,
  },
});

export default Addphoto;