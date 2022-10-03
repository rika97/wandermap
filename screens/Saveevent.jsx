import React, { useState } from 'react'
import { View, TextInput, Image, Button } from 'react-native'

import firebase from 'firebase/app'
require("firebase/firestore")

export default function Saveevent(props, {navigation}) {
  const [caption, setCaption] = useState("")
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
            caption,
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
            onChangeText={(caption) => setCaption(caption)}
        />
        <Button title="Create Event" onPress={() => uploadImage()} />
    </View>
  )
}
