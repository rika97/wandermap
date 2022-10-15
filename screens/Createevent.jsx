import React, { useState } from 'react';
import { Button, Image, View, TextInput, TouchableWithoutFeedback, Keyboard, Text, ActivityIndicator, Dimensions } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const windowHeight = Dimensions.get('window').height;

import firebase from 'firebase/app'
require("firebase/firestore")

export default function Createevent( {navigation} ) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [loading, setLoading] = useState(false)

  const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;

  const pickImage = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async () => {
    const uri = image;

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = firebase.storage().ref().child(childPath).put(blob)

    const taskProgress = snapshot => {
        setLoading(true)
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
  };

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
            navigation.popToTop()
        }))
  }

  return (
    <KeyboardAwareScrollView 
                    style={{
                        flex: 1,
                        backgroundColor: 'white'
                    }}
                    extraScrollHeight={100}
                    >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            { loading ? 
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ marginTop: windowHeight/3 }}>
                        <ActivityIndicator size="large" color="#30b5c7" />
                    </View>
                    <Text style={{ fontSize: 15, marginTop: 10, color: "#30b5c7"}}>Uploading...</Text>
                </View>:
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Button title="Choose Image" onPress={() => pickImage()} />
                    {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
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
            }
        </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
}