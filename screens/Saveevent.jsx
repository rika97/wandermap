import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'

import firebase from 'firebase/app'
require("firebase/firestore")

export default function Saveevent(props, {navigation}) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")

  const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;

  const uploadImage = async () => {
    const uri = props.route.params.image;

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob)

    const taskProgress = snapshot => {
        console.log(`transferred: ${snapshot.bytesTransferred}`)
    }

    const taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot)=>{
            saveEventData(snapshot)
            console.log(snapshot)
        })
    }

    const taskError = snapshot => {
        console.log(snapshot)
    }

    task.on("state_changed", taskProgress, taskError, taskCompleted);
  }

  const saveEventData = (downloadURL) => {
    firebase.firestore()
        .collection('events')
        .doc(firebase.auth().currentUser.uid)
        .collection("userEvents")
        .add({
            downloadURL,
            title,
            description,
            location,
            creation: firebase.firestore.FieldValue.serverTimestamp()
        }).then((function(){
            props.navigation.popToTop()
        }))
  }
  return (
    <View style={{flex: 1}}>
        <Image source={{uri: props.route.params.image}} />
        <TextInput 
            placeholder='Event Title'
            onChangeText={(title) => setTitle(title)}
        />
        <TextInput 
            placeholder='Description'
            onChangeText={(description) => setDescription(description)}
        />
        <TextInput 
            placeholder='Location'
            onChangeText={(location) => setLocation(location)}
        />
        <Button title="Create Event" onPress={() => uploadImage()} />
    </View>
  )
}
