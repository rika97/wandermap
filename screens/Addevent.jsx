import React, { useState } from 'react';
import { Button, Image, View, TouchableWithoutFeedback, Keyboard, Text, ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const dismissKeyboard = () => { if (Platform.OS != "web"){ Keyboard.dismiss(); } }

import firebase from 'firebase/app'
require("firebase/firestore")

const Createevent = ( props ) => {
  const [image, setImage] = useState("https://raw.githubusercontent.com/rika97/wandermap/main/assets/defaultevent-icon.png"); 
  const [title, setTitle] = useState("");
  const [modalState, setModalState] = useState(1);
  const [defaultDate, setDefaultDate] = useState(new Date());
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const FormatDate = (data) => {
    let dateTimeString =
      (data.getMonth() + 1) +
      '/' +
      data.getDate() +
      '/' +
      data.getFullYear() +
      ' ' +
      (data.getHours()<10?'0':'') + data.getHours() +
      ':' +
      (data.getMinutes()<10?'0':'') + data.getMinutes();
  
    return dateTimeString;
  };

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
            location: props.route.params.location,
            locationCoords: props.route.params.locationCoords,
            price,
            startDate,
            endDate,
            creator: props.route.params.name,
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
                <View style={{ marginTop: windowHeight/3 }}>
                    <ActivityIndicator size="large" color="#30b5c7" />
                </View>
                <Text style={{ fontSize: 15, marginTop: 10, color: "#30b5c7"}}>Creating Event...</Text>
            </View>:
            <View style={StyleSheet.absoluteFillObject}>
              <TextInput 
                  label='Event Title'
                  placeholder='Give it a cool name!'
                  mode='outlined'
                  onChangeText={(title) => setTitle(title)}
                  style={styles.textInput}
              />
              <TouchableOpacity
                  style={styles.button}
                  onPress={() => pickImage()}
              ><Text style={{color: 'white'}}>Choose Image</Text></TouchableOpacity>
              <Image source={{ uri: image }} style={{ width: windowHeight/6, height: windowHeight/6 }} />
              <TextInput 
                  label='Description'
                  placeholder='Enter description'
                  mode='outlined'
                  multiline
                  onChangeText={(description) => setDescription(description)}
                  style={styles.textInput}
              />
              <TextInput 
                  label='Price (units)'
                  mode='outlined'
                  onChangeText={(price) => setPrice(price)}
                  style={styles.textInput}
              />
                  <Button title="Choose Start Date" onPress={()=>{
                    setModalState(1);
                    showDatePicker();
                    }} />
                  <Text>{startDate}</Text>
                  <Button title="Choose End Date" onPress={()=>{
                    setModalState(2);
                    showDatePicker();
                    }} />
                  <Text>{endDate}</Text>
                  <DateTimePickerModal
                      isVisible={isDatePickerVisible}
                      mode="datetime"
                      date={defaultDate}
                      onConfirm={(date)=>{
                          if (modalState === 1) {
                            if (FormatDate(date) < FormatDate(new Date())) {
                              setStartDate("");
                              setErrorMsg("Start date must be later than current date.");
                            } else {
                              setStartDate(FormatDate(date));
                              setDefaultDate(date);
                              setErrorMsg("");
                            }
                          } else {
                            if (FormatDate(date) < startDate) {
                              setEndDate("");
                              setErrorMsg("End date must be later than start date.");
                            } else {
                              setEndDate(FormatDate(date));
                              setErrorMsg("");
                            }
                          }
                          hideDatePicker();
                      }}
                      onCancel={hideDatePicker}
                      textColor={'black'}
                  />
                  <Text style={{color: 'red'}}>{errorMsg}</Text>
                  <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        if (title == "" || title == " " || description == "" || description == " " || price == "" || startDate == "" || endDate == "") {
                          setErrorMsg("You must fill in all required fields.")
                        } else {
                          uploadImage()
                        }
                      }}
                  ><Text style={{color: 'white'}}>Create Event</Text></TouchableOpacity>
              </View>
        }
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
    textInput: {
      width: windowWidth-50,
      marginTop: 40,
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
    searchBar: {
      container: {
        marginTop: 10,
        // marginBottom: 10,
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

export default Createevent;