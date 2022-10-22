import React, { useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
 
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
 
 
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const dismissKeyboard = () => { if (Platform.OS != "web"){ Keyboard.dismiss(); } }
 
function Map(props) {
 const [location, setLocation] = useState(null);
 const [errorMsg, setErrorMsg] = useState(null);
 const [toggleViewer, setToggleViewer] = useState(false);
 
 useEffect(() => {
   (async () => {
    
     let { status } = await Location.requestForegroundPermissionsAsync();
     if (status !== 'granted') {
       setErrorMsg('Permission to access location was denied');
       return;
     }
 
     let location = await Location.getCurrentPositionAsync({});
     setLocation([location.coords.latitude, location.coords.longitude]);
   })();
 }, []);
 
 let text = 'Fetching Location...';
 if (errorMsg) {
   text = errorMsg;
 }

 const [events, setEvents] = useState([]);
  useEffect(() => {
    let events = [];

    if(props.usersLoaded == props.following.length){
        for(let i = 0; i < props.following.length; i++) {
            const user = props.users.find(element => element.uid === props.following[i])

            if(user != undefined) {
                events = [...events, ...user.events]
            }
        }

        events.sort(function(x,y) {
            return x.creation - y.creation;
        })

        setEvents(events);

    }
  }, [props.usersLoaded])
 
 if (location === null) {
   return (
     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <View>
           <ActivityIndicator size="large" color="#30b5c7" />
       </View>
       <Text style={{ fontSize: 15, marginTop: 10, color: "#30b5c7"}}>{text}</Text>
     </View>
   )}
 return (
     <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false}>
         <View style={{ flex: 1, width: windowWidth, height: windowHeight-180 }}>
           <MapView
             style={StyleSheet.absoluteFillObject}
             provider={PROVIDER_GOOGLE}
             showsUserLocation={true}
             followsUserLocation={true}
             showsMyLocationButton={true}
             showsIndoors={true}
             showsIndoorLevelPicker={true}
             loadingEnabled={true}
             rotateEnabled={true}
             scrollDuringRotateOrZoomEnabled={true}
             initialRegion={{latitude: location[0], longitude: location[1], latitudeDelta: 0.04, longitudeDelta: 0.04}}
             region={{latitude: location[0], longitude: location[1], latitudeDelta: 0.04, longitudeDelta: 0.04}}
             >
             <GooglePlacesAutocomplete
               placeholder='Search Location'
               onPress={(data, details = null) => {
                 setLocation([details.geometry.location.lat, details.geometry.location.lng])
               }}
               fetchDetails
               query={{
                 key: 'AIzaSyAfMkBC849cDs0ChbbncE_IXh-4SclMPpw',
                 language: 'en',
               }}
               renderLeftButton={()  => <MaterialCommunityIcons name="map-marker" color='grey' size={30} style={{marginLeft: 15, marginTop: 7.5}} />}
               styles={styles.searchBar}
             />
             {events.map(event => (
              <Marker 
                coordinate={{
                  latitude: event.locationCoords[0],
                  longitude: event.locationCoords[1]
                }}
                title={event.title}
                onPress={()=>{
                  setToggleViewer(!toggleViewer)
                  console.log(toggleViewer)}}
              >
                <View>
                  <Image
                    source={{uri: event.downloadURL}}
                    style={styles.pinImage}
                  />
               </View>
              </Marker>
            ))}

           </MapView>
           {/* <TouchableOpacity
               style={styles.toggleButton}
               onPress={() => setToggle(false)}
           ><MaterialCommunityIcons name="calendar-month" size={23} /><Text>Events</Text></TouchableOpacity> */}
         </View>
     </TouchableWithoutFeedback>
 )
}


const styles = StyleSheet.create({
  toggleButton: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 50,
    bottom: 10,
    position: "absolute",
    backgroundColor: 'white',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  chips: {
    width: 80,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    borderRadius: 50,
    marginTop: 70,
    marginLeft: 15,
    backgroundColor: 'white',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  searchBar: {
      container: {
        marginTop: 15,
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
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
        borderRadius: 30,
        height: 45,
        marginLeft: 15,
        marginRight: 15,
      },
      listView: {
        marginLeft: 35,
        marginRight: 35,
      }
  },
  pin: {

  },
  pinImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor: 'rgba(48, 181, 199, 0.3)',
    borderWidth: 6,
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Map);