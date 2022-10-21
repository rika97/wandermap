import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import firebase from 'firebase/app'
require("firebase/firestore")

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
            props.navigation.navigate("Community")
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
              <TextInput 
                  label='Caption'
                  placeholder='Enter caption'
                  mode='outlined'
                  multiline
                  onChangeText={(caption) => setCaption(caption)}
                  style={styles.textInput}
              />
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
                  onPress={() => {uploadImage()}}
              ><Text style={{color: 'white'}}>Post Photo</Text></TouchableOpacity>
            </View>
        }
    </TouchableWithoutFeedback>
  )
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "#8abbc2",
    padding: 10,
    borderRadius: 20,
    width: 250,
    height: 45,
    justifyContent: 'center',
    marginTop: 10,
  },
  searchBar: {
    container: {
      marginTop: 10,
    },
    textInput: {
      height: 45,
      marginLeft: 0,
      marginRight: 15,
      marginTop: 0,
      backgroundColor: 'white',
    },
    textInputContainer: {
      backgroundColor: 'white',
      borderRadius: 5,
      height: 50,
      marginLeft: 15,
      marginRight: 15,
      borderWidth: 1,
      borderColor: 'grey',
    },
    listView: {
      marginLeft: 20,
      marginRight: 20,
    }
},
});

export default Addphoto;