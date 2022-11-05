import React, { useState, useEffect } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions, ImageBackground } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import Slider from '@react-native-community/slider';

import { connect } from 'react-redux';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Photo = (props) => {
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null);
  const [zoomRatio, setZoomRatio] = useState(0);
  const [image, setImage] = useState(null);
  const [flashModeType, setFlashModeType] = useState([Camera.Constants.FlashMode.auto, "flash-auto"]);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { currentUser } = props
    setUser(currentUser)

  }, [])

  if (!permission) {
    return (
      <View>
        <View style={{ marginTop: windowHeight/3 }}>
            <ActivityIndicator size="large" color="#30b5c7" />
        </View>
        <Text style={{ fontSize: 15, marginTop: 10, color: "#30b5c7"}}>Loading...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button styles={{color: 'blue'}} onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  function toggleFlashModeType() {
    if (flashModeType[0] === Camera.Constants.FlashMode.auto) {
      setFlashModeType([Camera.Constants.FlashMode.off, "flash-off"])
    } else if (flashModeType[0] === Camera.Constants.FlashMode.off) {
      setFlashModeType([Camera.Constants.FlashMode.on, "flash"])
    } else {
      setFlashModeType([Camera.Constants.FlashMode.auto, "flash-auto"])
    }
  }

  const takePicture = async () => {
    if(camera){
        const data = await camera.takePictureAsync(null)
        setImage(data.uri);
    }
  }

  if (image) {
    return (
      <View style={{ flex: 1, alignItems: 'center'}}>
        <ImageBackground source={{uri: image}} style={{flex:1, width: windowWidth, height: undefined}}>
          <TouchableOpacity
            style={{flex: 1, alignSelf: 'flex-start', alignItems: 'center', marginLeft: 5, marginTop: 30}}
            onPress={() => setImage(null)}
            >
            <IconButton
              icon="arrow-left"
              size={30}
              iconColor='white'
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{flex: 1, alignSelf: 'flex-end', position: "absolute", marginRight: 5, bottom: 30}}
            onPress={() => props.navigation.navigate("Addphoto", { image, user })}
            >
            <IconButton
              icon="send"
              size={30}
              iconColor='white'
            />
          </TouchableOpacity>
        </ImageBackground>
      </View>
    )
  } else {
  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flashModeType[0]}
        ref={ref => setCamera(ref)}
        zoom={zoomRatio}
      >
      <TouchableOpacity
        style={{flex: 1, alignSelf: 'flex-start', alignItems: 'center', marginLeft: 5, marginTop: 30}}
        onPress={()=> props.navigation.navigate("Map")}
        >
        <IconButton
          icon="window-close"
          size={30}
          iconColor='white'
        />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <IconButton
            icon="camera-flip"
            size={25}
            iconColor='white'
            mode='outlined'
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} >
          <IconButton
            icon={"checkbox-blank-circle-outline"}
            size={50}
            iconColor='white'
            mode='outlined'
            onPress={() => {
              takePicture();
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            toggleFlashModeType();
          }}
        >
          <IconButton
            icon={flashModeType[1]}
            size={25}
            iconColor='white'
            mode='outlined'
          />
        </TouchableOpacity>
      </View>
      <Slider
        style={{width: 250, height: 30, marginBottom: 50, marginTop: -60, marginLeft: (windowWidth-250)/2}}
        minimumValue={0}
        maximumValue={1}
        minimumTrackTintColor="#000000"
        maximumTrackTintColor="#000000"
        tapToSeek
        onValueChange={(ratio)=>setZoomRatio(-1+Math.pow(2.71828, 0.4*ratio))}
      />
      </Camera>
      {image && <Image source={{uri: image}} style={{flex:1}}/>}
    </View>
  )};
}

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
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps, null)(Photo);