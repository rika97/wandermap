import React, { useState } from 'react';
import { Image, View, TouchableWithoutFeedback, Keyboard, Text, ActivityIndicator, Dimensions, StyleSheet, TouchableOpacity, Platform, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';

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
  const [startDateTimestamp, setStartDateTimestamp] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endDateTimestamp, setEndDateTimestamp] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [category, setCategory] = useState("");

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
            category,
            startDate,
            startDateTimestamp,
            endDate,
            endDateTimestamp,
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
                <View>
                    <ActivityIndicator size="large" color="#30b5c7" />
                </View>
                <Text style={{ fontSize: 15, marginTop: 10, color: "#30b5c7"}}>Creating Event...</Text>
            </View>:
            <View style={StyleSheet.absoluteFillObject}>
              <View style={styles.wrapper}>
                <View style={styles.container}>
                  <Text style={styles.header}>Event Title:</Text>
                  <TextInput 
                      placeholder='Enter title'
                      mode='outlined'
                      onChangeText={(title) => setTitle(title)}
                      style={styles.textInput}
                  />
                </View>
                <View style={styles.container}>
                  <View style={styles.containerRow}>
                    <Text style={styles.header}>Starts:</Text>
                    <Text style={styles.body}>{startDate}</Text>
                    <TouchableOpacity
                      style={styles.select}
                      onPress={()=>{
                        setModalState(1);
                        showDatePicker();
                        }}
                    ><Text style={{color: 'white'}}>Select</Text></TouchableOpacity>
                  </View>
                  <View style={styles.containerRow}>
                    <Text style={styles.header}>Ends:</Text>
                    <Text style={styles.body}>{endDate}</Text>
                    <TouchableOpacity
                      style={styles.select}
                      onPress={()=>{
                        setModalState(2);
                        showDatePicker();
                        }}
                    ><Text style={{color: 'white'}}>Select</Text></TouchableOpacity>
                  </View>
                </View>
                <View style={styles.container}>
                  <Text style={styles.header}>Description:</Text>
                  <TextInput 
                      placeholder='Enter description'
                      mode='outlined'
                      multiline
                      numberOfLines={5}
                      onChangeText={(description) => setDescription(description)}
                      style={styles.descriptionInput}
                  />
                </View>
                <View style={styles.container}>
                  <View style={styles.containerRow}>
                    <Text style={styles.header}>Price:</Text>
                    <TextInput 
                        placeholder='Enter price (units)'
                        mode='outlined'
                        onChangeText={(price) => setPrice(price)}
                        style={styles.rowInput}
                    />
                  </View>
                </View>
                <View style={styles.container}>
                  <View style={styles.containerRow}>
                    <Text style={styles.header}>Category:</Text>
                    <TouchableOpacity style={styles.dropdown}>
                      <RNPickerSelect
                        placeholder={{label: "Select a category"}}
                        onValueChange={(value) => setCategory(value)}
                        items={[
                            { label: 'Music', value: 'music' },
                            { label: 'Food & Drinks', value: 'food' },
                            { label: 'Party', value: 'party' },
                            { label: 'Festival', value: 'festival' },
                            { label: 'Performance', value: 'performance' },
                            { label: 'Screening', value: 'screening' },
                            { label: 'Tournament', value: 'tournament' },
                            { label: 'Networking', value: 'networking' },
                            { label: 'Expo', value: 'expo' },
                            { label: 'Business', value: 'business' },
                            { label: 'Game', value: 'game' },
                            { label: 'Convention', value: 'convention' },
                            { label: 'Seminar', value: 'seminar' },
                            { label: 'Race', value: 'race' },
                            { label: 'Attraction', value: 'attraction' },
                            { label: 'Sports', value: 'sports' },
                        ]}
                    />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.container}>
                  <View style={styles.containerRow}>
                    <Text style={styles.header}>Image:</Text>
                    <TouchableOpacity
                      style={styles.select}
                      onPress={() => pickImage()}
                    ><Text style={{color: 'white'}}>Select</Text></TouchableOpacity>
                  </View>
                  <Image source={{ uri: image }} style={{ width: 80, height: 80 }} />
                </View>
                <Text style={{color: 'red', margin: 5}}>{errorMsg}</Text>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      if (title == "" || title == " " || description == "" || description == " " || price == "" || category == "" || startDate == "" || endDate == "") {
                        setErrorMsg("You must fill in all required fields.")
                      } else {
                        uploadImage()
                      }
                    }}
                ><Text style={{color: 'white'}}>Create Event</Text></TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    date={defaultDate}
                    onConfirm={(date)=>{
                        if (modalState === 1) {
                          if (date.getTime() < new Date().getTime()) {
                            setStartDate("");
                            setErrorMsg("Start date must be later than current date.");
                          } else {
                            setStartDate(FormatDate(date));
                            setStartDateTimestamp(date.getTime())
                            setDefaultDate(date);
                            setErrorMsg("");
                          }
                        } else {
                          if (date.getTime() < defaultDate.getTime()) {
                            setEndDate("");
                            setErrorMsg("End date must be later than start date.");
                          } else {
                            setEndDate(FormatDate(date));
                            setEndDateTimestamp(date.getTime());
                            setErrorMsg("");
                          }
                        }
                        hideDatePicker();
                    }}
                    onCancel={hideDatePicker}
                    textColor={'black'}
                />
              </View>
            </View>
        }
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
    wrapper: {
      marginTop: 5,
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    textInput: {
      marginTop: 5,
      backgroundColor: "#cfe3e6",
      borderRadius: 10,
      fontSize: 16,
      padding: 10,
    },
    rowInput: {
      marginTop: -7,
      marginBottom: -7,
      marginLeft: 70,
      backgroundColor: "#cfe3e6",
      borderColor: "#cfe3e6",
      borderRadius: 10,
      fontSize: 16,
      padding: 10,
      width: 200,
    },
    descriptionInput: {
      marginTop: 5,
      backgroundColor: "#cfe3e6",
      borderRadius: 10,
      fontSize: 16,
      padding: 10,
      height: 130,
    },
    dropdown: {
      marginTop: -7,
      marginBottom: -7,
      marginLeft: 40,
      backgroundColor: "#cfe3e6",
      borderColor: "#cfe3e6",
      borderRadius: 10,
      padding: 10,
      width: 200,
      height: 40,
      
    },
    button: {
      alignItems: "center",
      backgroundColor: "#30b5c7",
      padding: 10,
      borderRadius: 20,
      width: 250,
      height: 45,
      justifyContent: 'center',
    },
    select: {
      alignItems: "center",
      backgroundColor: "#30b5c7",
      padding: 5,
      borderRadius: 15,
      width: 70,
      height: 30,
      position: 'absolute',
      right: 0,
      marginTop: -3,
    },
    container: {
      backgroundColor: "#8abbc2",
      borderRadius: 15,
      padding: 12,
      marginTop: 10,
      marginLeft: 15,
      marginRight: 15,
      width: windowWidth-30,
    },
    containerRow: {
      flexDirection: "row",
      marginBottom: 7,
      marginTop: 7,
    },
    header: {
      fontSize: 16,
      fontWeight: "bold",
      alignItems: 'center',
      justifyContent: 'center'
    },
    body: {
      fontSize: 16,
      fontWeight: 'bold',
      position: 'absolute',
      left: 60,
      color: "#143F73"
    }
  });

export default Createevent;