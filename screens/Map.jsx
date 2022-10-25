import React, { useState, useEffect } from 'react';
import { Image, View, Text, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
 
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';

import BottomSheet from '@gorhom/bottom-sheet';
 
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const dismissKeyboard = () => { if (Platform.OS != "web"){ Keyboard.dismiss(); } }
 
function Map(props) {
 const [location, setLocation] = useState(null);
 const [errorMsg, setErrorMsg] = useState(null);
 const [eventDetails, setEventDetails] = useState({title: "Click on a marker to view event", description: ""});
 const [photoDetails, setPhotoDetails] = useState({caption: "Click on a marker to view photo"});
 const [toggleFilter, setToggleFilter] = useState(true);
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
 const [photos, setPhotos] = useState([]);
  useEffect(() => {
    let events = [];
    let photos = [];

    if(props.usersLoaded == props.following.length){
        for(let i = 0; i < props.following.length; i++) {
            const user = props.users.find(element => element.uid === props.following[i])

            if(user != undefined) {
                events = [...events, ...user.events]
                photos = [...photos, ...user.photos]
            }
        }

        setEvents(events);
        setPhotos(photos);

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
             initialRegion={{latitude: location[0], longitude: location[1], latitudeDelta: 0.3, longitudeDelta: 0.04}}
             region={{latitude: location[0], longitude: location[1], latitudeDelta: 0.3, longitudeDelta: 0.04}}
             >
             <GooglePlacesAutocomplete
               placeholder='Search Location'
               onPress={(data, details = null) => {
                 setLocation([details.geometry.location.lat, details.geometry.location.lng])
               }}
               fetchDetails
               query={{
                 key: '',
                 language: 'en',
               }}
               renderLeftButton={()  => <MaterialCommunityIcons name="map-marker" color='grey' size={30} style={{marginLeft: 15, marginTop: 7.5}} />}
               styles={styles.searchBar}
             />
             {toggleFilter ?
              events.map(event => (
                <Marker 
                  coordinate={{
                    latitude: event.locationCoords[0],
                    longitude: event.locationCoords[1]
                  }}
                  title={event.title}
                  onPress={()=>{
                    setEventDetails(event)
                    }}
                >
                  <View>
                    <Image
                      source={{uri: event.downloadURL}}
                      style={styles.pinImage}
                    />
                </View>
                </Marker>
              )) : 
              photos.map(photo => (
                <Marker 
                  coordinate={{
                    latitude: photo.locationCoords[0],
                    longitude: photo.locationCoords[1]
                  }}
                  title={photo.caption}
                  onPress={()=>{
                    setPhotoDetails(photo)
                    }}
                >
                  <View>
                    <Image
                      source={{uri: photo.downloadURL}}
                      style={styles.pinImage}
                    />
                 </View>
                </Marker>
              ))
             }

           </MapView>
           <TouchableOpacity
               style={styles.toggleButton}
               onPress={() => setToggleFilter(!toggleFilter)}
           >
            { toggleFilter ? 
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><MaterialCommunityIcons name="account-group" size={20} /><Text>Community</Text></View> :
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><MaterialCommunityIcons name="calendar-month" size={20} /><Text>Events</Text></View>
            }
           </TouchableOpacity>
           {toggleFilter ?
           <BottomSheet snapPoints={[20, 200, windowHeight-200]}>
           <Text style={{fontSize: 25, fontWeight: 'bold', marginLeft: 5 }}>{eventDetails.title}</Text>
           <Image
             style={styles.detailImage}
             source={{uri: eventDetails.downloadURL}}
           />
           <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 5, marginTop: 5 }}>
            <Image
              style={styles.profileImage}
              source={{uri: eventDetails.user?.downloadURL || "https://raw.githubusercontent.com/rika97/wandermap/main/assets/defaultuser-icon.png"}}
            />
            <Text style={{fontWeight: 'bold', marginTop: 8, marginLeft: 5}}>{eventDetails.creator}</Text>
          </View>
           <View style={{marginLeft: 5, marginTop: 5}}>
            <Text style={{fontSize: 17, fontWeight: 'bold'}}>Location:</Text>
            <Text>{eventDetails.location}</Text>
            <Text style={{fontSize: 17, fontWeight: 'bold'}}>Date & Time:</Text>
            <Text style={{fontSize: 17}}>{eventDetails.startDate} ~ {eventDetails.endDate}</Text>
            <Text style={{fontSize: 17, fontWeight: 'bold'}}>Price:</Text>
            <Text style={{fontSize: 17}}>{eventDetails.price}</Text>
            <Text style={{fontSize: 17, fontWeight: 'bold'}}>Description:</Text>
            <Text>{eventDetails.description}</Text>
          </View>
          </BottomSheet> :
          <BottomSheet snapPoints={[30, 200, windowHeight-200]}>
          <Text style={{fontSize: 25, fontWeight: 'bold', marginLeft: 5 }}>{photoDetails.caption}</Text>
          <Image
            style={styles.detailImage}
            source={{uri: photoDetails.downloadURL}}
          />
          <View style={{marginLeft: 5, marginTop: 5}}>
            <Text style={{fontSize: 17, fontWeight: 'bold'}}>Location:</Text>
            <Text>{photoDetails.location}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 5, marginTop: 5 }}>
            <Image
              style={styles.profileImage}
              source={{uri: photoDetails.user?.downloadURL || "https://raw.githubusercontent.com/rika97/wandermap/main/assets/defaultuser-icon.png"}}
            />
            <Text style={{fontWeight: 'bold', marginTop: 8, marginLeft: 5}}>{photoDetails.creator}</Text>
          </View>
         </BottomSheet>
         }
         </View>
     </TouchableWithoutFeedback>
 )
}


const styles = StyleSheet.create({
  toggleButton: {
    flex: 1,
    flexDirection: "row",
    width: 115,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    padding: 7,
    borderRadius: 50,
    top: 70,
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
  },
  detailImage: {
    width: windowWidth,
    height: windowWidth,
    aspectRatio: 1,
  },
  profileImage: {
    width: 35,
    height: 35,
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Map);