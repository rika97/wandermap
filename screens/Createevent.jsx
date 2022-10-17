import React, { useState } from 'react';
import { Image, View, TouchableWithoutFeedback, Keyboard, Text, ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const dismissKeyboard = () => { if (Platform.OS != "web"){ Keyboard.dismiss(); } }

import firebase from 'firebase/app'
require("firebase/firestore")

const Createevent = ( {navigation} ) => {
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
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false}>
            { loading ? 
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ marginTop: windowHeight/3 }}>
                        <ActivityIndicator size="large" color="#30b5c7" />
                    </View>
                    <Text style={{ fontSize: 15, marginTop: 10, color: "#30b5c7"}}>Uploading...</Text>
                </View>:
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View>
                        <TextInput 
                            label='Event Title'
                            placeholder='Give it a cool name'
                            mode='outlined'
                            onChangeText={(title) => setTitle(title)}
                            style={styles.textInput}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => pickImage()}
                        ><Text style={{color: 'white'}}>Choose Image</Text></TouchableOpacity>
                        {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                        <TextInput 
                            label='Description'
                            placeholder='Enter description'
                            mode='outlined'
                            multiline
                            onChangeText={(description) => setDescription(description)}
                            style={styles.textInput}
                        />
                        <TextInput 
                            label='Location'
                            mode='outlined'
                            onChangeText={(location) => setLocation(location)}
                            style={styles.textInput}
                        />
                    </View>
                    <View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => uploadImage()}
                        ><Text style={{color: 'white'}}>Create Event</Text></TouchableOpacity>
                    </View>
                </View>
            }
        </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
    textInput: {
      width: windowWidth-50,
      marginTop: 5,
    },
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

export default Createevent;