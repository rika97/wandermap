import React, { useState, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, ImageBackground } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { connect } from 'react-redux';

const Eventviewer = (props) => {
  const event = props.route.params.event
  const [user, setUser] = useState(null);
  const [profilePicURI, setProfilePicURI] = useState("");
  useEffect(() => {
    const { currentUser } = props
    setUser(currentUser)

  }, [])
  console.log(event)
  return (
    <View style={styles.container}>
        <Text>{event.title}</Text>
        <Image
            style={styles.image}
            source={{uri: event.downloadURL}}
        />
        <Image
          style={styles.profilePic}
          source={{uri: props.route.params.profilePic}}
        />
        <Text style={{fontSize: 17, marginTop: 5}}>{event.creator}</Text>
        <Image
          style={styles.profilePic}
          source={{uri: event.downloadURL}}
        />
        <Text>{event.location}</Text>
        <Text>{event.startDate}</Text>
        <Text>{event.endDate}</Text>
        <Text>{event.description}</Text>
    </View>
  )};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  touchableButton: {
    alignItems: "center",
    backgroundColor: "#8abbc2",
    padding: 10,
    borderRadius: 20,
    width: 300,
    height: 45,
    justifyContent: 'center',
    marginTop: 5,
    marginBottom:30,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profilePic: {
    width: 20,
    height: 20
  }
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps, null)(Eventviewer);