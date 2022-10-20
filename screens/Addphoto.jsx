import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, ActivityIndicator, Dimensions } from 'react-native';
import { TextInput } from 'react-native-paper';

import firebase from 'firebase/app'
require("firebase/firestore")

const windowHeight = Dimensions.get('window').height;

const dismissKeyboard = () => { if (Platform.OS != "web"){ Keyboard.dismiss(); } }

const Addphoto = (props) => {
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

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
});

export default Addphoto;