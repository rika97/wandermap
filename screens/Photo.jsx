import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, Dimensions } from 'react-native';
import { Button, IconButton } from 'react-native-paper';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

export default function Photo(props) {
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [flashModeType, setFlashModeType] = useState([Camera.Constants.FlashMode.auto, "flash-auto"]);
  const [permission, requestPermission] = Camera.useCameraPermissions();

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
        <Button onPress={requestPermission} title="grant permission" />
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
        <Image source={{uri: image}} style={{flex:1, width: windowWidth, height: undefined}}/>
        <TouchableOpacity
            style={styles.touchableButton}
            onPress={() => setImage(null)}
        ><Text style={{color: 'white'}}>Re-take</Text></TouchableOpacity>
        <TouchableOpacity
            style={styles.touchableButton}
            // onPress={() => setImage(null)}
        ><Text style={{color: 'white'}}>Post</Text></TouchableOpacity>
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
      >
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
          <IconButton
            icon="camera-flip"
            size={30}
            iconColor='white'
            mode='outlined'
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} >
          <IconButton
            icon={"checkbox-blank-circle-outline"}
            size={45}
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
            size={30}
            iconColor='white'
            mode='outlined'
          />
        </TouchableOpacity>
      </View>
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
    backgroundColor: "#6b4fab",
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
