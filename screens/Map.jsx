import React, { useState, useEffect, useRef } from 'react';
import { Image, View, Text, StyleSheet, Dimensions, Keyboard, TouchableWithoutFeedback, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { connect } from 'react-redux';
 
import { PROVIDER_GOOGLE } from 'react-native-maps';
import { Marker } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import MapView from "react-native-map-clustering";
import getDirections from 'react-native-google-maps-directions'

import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
 
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const dismissKeyboard = () => { if (Platform.OS != "web"){ Keyboard.dismiss(); } }
 
function Map(props) {
 const [currentLocation, setCurrentLocation] = useState(null);
 const [errorMsg, setErrorMsg] = useState(null);
 const [eventDetails, setEventDetails] = useState({title: "Click on a marker to view event", description: ""});
 const [photoDetails, setPhotoDetails] = useState({caption: "Click on a marker to view photo"});
 const [toggleFilter, setToggleFilter] = useState(true);
 
 useEffect(() => {
   (async () => {
    
     let { status } = await Location.requestForegroundPermissionsAsync();
     if (status !== 'granted') {
       setErrorMsg('Permission to access location was denied');
       return;
     }
 
     let location = await Location.getCurrentPositionAsync({});
     setCurrentLocation([location.coords.latitude, location.coords.longitude]);

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

  const mapRef = useRef(null);
  const animate = (coordinate) => {
    let newRegion = {latitude: coordinate[0], longitude: coordinate[1], latitudeDelta: 0.1, longitudeDelta: 0.04};
    mapRef.current.animateToRegion(newRegion, 800);
  }

 if (currentLocation === null) {
   return (
     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
       <View>
           <ActivityIndicator size="large" color="#30b5c7" />
       </View>
       <Text style={{ fontSize: 15, marginTop: 10, color: "#30b5c7"}}>{text}</Text>
     </View>
   )}

  const handleGetDirections = () => {
    const data = {
      source: {
        latitude: currentLocation[0],
        longitude: currentLocation[1]
      },
      destination: {
        latitude: eventDetails.locationCoords[0],
        longitude: eventDetails.locationCoords[1]
      }
    }
    getDirections(data);
  };

  const timestampFormatter = (timestamp) => {
    var date = new Date(timestamp);
    let month = date.getMonth() + 1;
    let day = date.getDate();

    const getMonthName = (monthNumber) => {
      const date = new Date();
      date.setMonth(monthNumber - 1);
    
      return date.toLocaleString('en-US', { month: 'short' });
    }

    return [getMonthName(month), day]
  }

 return (
     <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false}>
         <View style={{ flex: 1, width: windowWidth, height: windowHeight-180 }}>
           <MapView
             style={StyleSheet.absoluteFillObject}
             provider={PROVIDER_GOOGLE}
             ref={mapRef}
             showsUserLocation={true}
             followsUserLocation={true}
             showsMyLocationButton={true}
             showsIndoors={true}
             showsIndoorLevelPicker={true}
             loadingEnabled={true}
             rotateEnabled={true}
             scrollDuringRotateOrZoomEnabled={true}
             initialRegion={{latitude: currentLocation[0], longitude: currentLocation[1], latitudeDelta: 0.3, longitudeDelta: 0.04}}
             onClusterPress={(coordinate) => {
              animate([coordinate.geometry.coordinates[1], coordinate.geometry.coordinates[0]])
            }}
             clustering = {true}
             clusterColor="#30b5c7"
             radius = {50}
             >
             <GooglePlacesAutocomplete
               placeholder='Search Location'
               onPress={(data, details = null) => {
                animate([details.geometry.location.lat, details.geometry.location.lng])
               }}
               fetchDetails
               query={{
                 key: '',
                 language: 'en',
               }}
               renderLeftButton={()  => <MaterialCommunityIcons name="map-marker" color='grey' size={30} style={{marginLeft: 20, marginTop: 7.5, top: 15}} />}
               styles={styles.searchBar}
             />
             {toggleFilter ?
              events.map(event => (
                ((event.endDateTimestamp > new Date().getTime()) && ((new Date().getTime() - event.startDateTimestamp) < 24*3600*30*1000 )) ? 
                  <Marker 
                  coordinate={{
                    latitude: event.locationCoords[0],
                    longitude: event.locationCoords[1]
                  }}
                  title={event.title}
                  onPress={()=>{
                    animate([event.locationCoords[0], event.locationCoords[1]])
                    setEventDetails(event)
                    }}
                  key={event.id}
                >
                  <View>
                    <Image
                      source={{uri: event.downloadURL}}
                      style={styles.pinImage}
                    />
                  </View>
                </Marker> : ""
              )) : 
              photos.map(photo => (
                (new Date().getTime() - 1000*photo.creation.seconds < 3600*24*1000) ? 
                <Marker 
                  coordinate={{
                    latitude: photo.locationCoords[0],
                    longitude: photo.locationCoords[1]
                  }}
                  title={photo.caption}
                  onPress={()=>{
                    animate([photo.locationCoords[0], photo.locationCoords[1]])
                    setPhotoDetails(photo)
                    }}
                  key={photo.id}
                >
                  <View>
                    <Image
                      source={{uri: photo.downloadURL}}
                      style={styles.pinImage}
                    />
                 </View>
                </Marker> : ""
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
           <BottomSheet snapPoints={[25, 200, windowHeight-200]}>
            <BottomSheetScrollView>
              <Text style={{fontSize: 25, fontWeight: 'bold', marginLeft: 10 }}>{eventDetails.title}</Text>
              <Image
                style={styles.detailImage}
                source={{uri: eventDetails.downloadURL}}
              />
              <View style={{marginHorizontal: 10, marginTop: -50, backgroundColor: '#bce3e8', borderRadius: 30, padding: 10}}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 5, marginTop: 5 }}>
                  <Image
                    style={styles.profileImage}
                    source={{uri: eventDetails.user?.downloadURL || "https://raw.githubusercontent.com/rika97/wandermap/main/assets/defaultuser-icon.png"}}
                  />
                  <Text style={{fontWeight: 'bold', marginTop: 8, marginLeft: 5}}>{eventDetails.creator}</Text>
                </View>
                <Text style={styles.textDetailHeader}>Location:</Text>
                <Text>{eventDetails.location}</Text>
                <Text style={styles.textDetailHeader}>Date & Time:</Text>
                <Text>{eventDetails.startDate} ~ {eventDetails.endDate}</Text>
                <Text style={styles.textDetailHeader}>Price:</Text>
                <Text>{eventDetails.price}</Text>
                <Text style={styles.textDetailHeader}>Description:</Text>
                <Text>{eventDetails.description}</Text>
                { eventDetails.location ? <TouchableOpacity onPress={handleGetDirections} style={styles.getDirectionsButton}>
                  <Text style={{color: "white"}}>
                    Get Directions
                  </Text>
                </TouchableOpacity>
                : ""}
              </View>
              <View style={{backgroundColor: "#30b5c7", borderRadius: 30, width: 80, height: 80, position: 'absolute', top: 370, right: 20, alignItems: 'center'}}>
                <Text style={{color: 'white', fontSize: 40}}>{timestampFormatter(eventDetails.startDateTimestamp)[1]}</Text>
                <Text style={{color: 'white', fontSize: 16}}>{timestampFormatter(eventDetails.startDateTimestamp)[0]}</Text>
              </View>
            </BottomSheetScrollView>
          </BottomSheet> :
          <BottomSheet snapPoints={[25, 200, windowHeight-200]}>
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
    bottom: 40,
    position: "absolute",
    backgroundColor: 'white',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  getDirectionsButton: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#30b5c7",
    padding: 10,
    borderRadius: 30,
    width: 200,
    height: 45,
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
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
        shadowColor: '#171717',
        shadowOffset: {width: -2, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 3,
        top: 15,
      },
      textInput: {
        height: 45,
        marginLeft: 0,
        marginRight: 15,
        backgroundColor: 'white',
        top: 15,
      },
      textInputContainer: {
        backgroundColor: 'white',
        borderRadius: 30,
        height: 45,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 0,
      },
      listView: {
        marginHorizontal: 35
      }
  },
  pinImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    borderColor: 'rgba(48, 181, 199, 0.3)',
    borderWidth: 6,
  },
  detailImage: {
    width: windowWidth-20,
    height: windowWidth-20,
    aspectRatio: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    margin: 10
  },
  profileImage: {
    width: 35,
    height: 35,
  },
  textDetailHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 5,
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Map);