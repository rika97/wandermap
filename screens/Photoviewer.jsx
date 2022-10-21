import React, { useState, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, ImageBackground } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { connect } from 'react-redux';

const Photoviewer = (props) => {
  const photo = props.route.params.photo
  const [user, setUser] = useState(null);
  useEffect(() => {
    const { currentUser } = props
    setUser(currentUser)

  }, [])
  return (
    <View style={styles.container}>
        <Image
            style={styles.profilePic}
            source={{uri: props.currentUser.downloadURL}}
        />
        <Text style={{fontSize: 17, marginTop: 5}}>{photo.creator}</Text>
        <Image
            style={styles.image}
            source={{uri: photo.downloadURL}}
        />
        <Text>{photo.caption}</Text>
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

export default connect(mapStateToProps, null)(Photoviewer);