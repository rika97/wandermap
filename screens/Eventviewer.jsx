import React, { useState, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, ImageBackground } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { connect } from 'react-redux';

const windowWidth = Dimensions.get('window').width;

const Eventviewer = (props) => {
  const event = props.route.params.event
  const [user, setUser] = useState(null);
  const [profilePicURI, setProfilePicURI] = useState("");
  useEffect(() => {
    const { currentUser } = props
    setUser(currentUser)

  }, [])
  return (
    <View style={styles.container}>
        <Text style={{marginLeft: 5, fontWeight: 'bold', fontSize: 25, marginTop: 10}}>{event.title}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 5, marginBottom: 5}}>
          <Image
            style={styles.profilePic}
            source={{uri: props.route.params.profilePic}}
          />
          <Text style={{fontWeight: 'bold', marginTop: 8, marginLeft: 5}}>{event.creator}</Text>
        </View>
        <Image
            style={styles.image}
            source={{uri: event.downloadURL}}
        />
        <View style={{marginLeft: 5}}>
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>Location:</Text>
          <Text>{event.location}</Text>
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>Start:</Text>
          <Text style={{fontSize: 17}}>{event.startDate}</Text>
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>End:</Text>
          <Text style={{fontSize: 17}}>{event.endDate}</Text>
          <Text style={{fontSize: 17, fontWeight: 'bold'}}>Description:</Text>
          <Text style={{fontSize: 15}}>{event.description}</Text>
        </View>
    </View>
  )};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: 35,
    height: 35,
  },
  image: {
    width: windowWidth,
    height: undefined,
    aspectRatio: 1
  }
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps, null)(Eventviewer);