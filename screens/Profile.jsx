import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity, Dimensions } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { FlatGrid } from 'react-native-super-grid';

import firebase from 'firebase/app';
require('firebase/firestore');
import { connect } from 'react-redux';

const windowWidth = Dimensions.get('window').width;

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Profile = (props) => {
  const [userEvents, setUserEvents] = useState([]);
  const [userPhotos, setUserPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);
  const [segmentedValue, setSegmentedValue] = React.useState('events');

  
  useEffect(() => {
      firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    setUser(snapshot.data())
                } else {
                    console.log("User doesn't exist.")
                }
            })
      firebase.firestore()
      .collection("events")
      .doc(props.route.params.uid)
      .collection("userEvents")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
          let events = snapshot.docs.map(doc => {
              const data = doc.data();
              const id = doc.id;
              return{id, ...data}
          })
          events.sort(function(x,y) {
            return x.startDateTimestamp - y.startDateTimestamp;
        })
          setUserEvents(events)
      })
      firebase.firestore()
      .collection("photos")
      .doc(props.route.params.uid)
      .collection("userPhotos")
      .orderBy("creation", "asc")
      .get()
      .then((snapshot) => {
          let photos = snapshot.docs.map(doc => {
              const data = doc.data();
              const id = doc.id;
              return{id, ...data}
          })
          photos.sort(function(x,y) {
            return y.creation - x.creation;
        })
          setUserPhotos(photos)
      })

    if(props.following.indexOf(props.route.params.uid) > -1) {
      setFollowing(true);
    } else {
      setFollowing(false);
    }
  }, [props.route.params.uid, props.following])

  const onFollow = () => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .set({})
  }
  const onUnfollow = () => {
    firebase.firestore()
      .collection("following")
      .doc(firebase.auth().currentUser.uid)
      .collection("userFollowing")
      .doc(props.route.params.uid)
      .delete()
  }
  if(user === null) {
    return (
    <View>
        <Text>User doesn't exist.</Text>
    </View>)
  };

  const timestampToDate = (timestamp) => {
    let hours = Math.floor((new Date() - timestamp.toDate())/1000/3600);
    if ( hours < 1) {
      return Math.floor((new Date() - timestamp.toDate())/1000/60) + " minutes ago"
    } else if (hours < 2) {
      return hours + " hour ago"
    } else if (hours < 24) {
      return hours + " hours ago"
    } else if (hours < 24*7) {
      return  Math.floor((new Date() - timestamp.toDate())/1000/3600/24) + " days ago"
    } else if (hours < 24*7*2) {
      return  Math.floor((new Date() - timestamp.toDate())/1000/3600/24/7) + " week ago"
    } else if (hours < 24*31) {
      return  Math.floor((new Date() - timestamp.toDate())/1000/3600/24/7) + " weeks ago"
    } else if (hours < 24*365) {
      return  Math.floor((new Date() - timestamp.toDate())/1000/3600/24/31) + " months ago"
    } else {
      return  Math.floor((new Date() - timestamp.toDate())/1000/3600/24/365) + " years ago"
    }
  };

  return (
    <KeyboardAwareScrollView 
      style={{
          flex: 1,
          backgroundColor: 'white'
      }}
      extraScrollHeight={100}
      >
      <View style={styles.container}>
      <View style={styles.containerInfo}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 5, marginBottom: 5}}>
          <Image source={{uri: user.downloadURL}} style={{ width: 60, height: 60}}/>
          <Text style={{fontSize: 20, marginTop: 20, marginLeft: 10, fontWeight: 'bold'}}>{user.name}</Text>
        </View>
          <View>
            {following ? (
              <TouchableOpacity 
              style={styles.button}
              onPress={() => onUnfollow()}
            ><Text style={{color: 'white'}}>Unfollow</Text></TouchableOpacity>
            ):
            (
              <TouchableOpacity 
              style={styles.button}
              onPress={() => onFollow()}
            ><Text style={{color: 'white'}}>Follow</Text></TouchableOpacity>
            )
            }
          </View>
      </View>
      <SegmentedButtons
        value={segmentedValue}
        onValueChange={setSegmentedValue}
        buttons={[
          {
            value: 'events',
            label: 'Events',
          },
          {
            value: 'photos',
            label: 'Photos',
          },
        ]}
        style={styles.segmentedButton}
   />
  { segmentedValue === "events" ? 
    <View style={styles.eventGallery}>
      <Text style={{fontSize: 20, marginTop: 20, marginLeft: 10, fontWeight: 'bold'}}>Upcoming Events</Text>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={userEvents}
        renderItem={({item}) => (
          (item.endDateTimestamp > new Date().getTime()) ?
          <View style={styles.containerImage}>
            <TouchableOpacity onPress={() => 
              props.navigation.navigate("Eventviewer", {event: item, profilePic: props.currentUser.downloadURL })
              }>
              <Image
                  style={styles.eventImage}
                  source={{uri: item.downloadURL}}
                />
                <View style={{ marginTop: -50, marginHorizontal: 10, backgroundColor: '#bce3e8', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, padding: 10, width: windowWidth-40}}>
                  <Text style={{fontSize: 17, fontWeight: 'bold'}}>{item.title}</Text>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>{item.startDate}</Text>
                  <Text style={{width: windowWidth - 50, marginBottom: 10}}>{item.location}</Text>
                </View>
            </TouchableOpacity>
          </View> : ""
        )}
      />
      <Text style={{fontSize: 20, marginTop: 20, marginLeft: 10, fontWeight: 'bold'}}>Past Events</Text>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={userEvents}
        renderItem={({item}) => (
          (item.endDateTimestamp <= new Date().getTime()) ?
          <View style={styles.containerImage}>
            <TouchableOpacity onPress={() => 
              props.navigation.navigate("Eventviewer", {event: item, profilePic: props.currentUser.downloadURL })
              }>
              <Image
                  style={styles.eventImage}
                  source={{uri: item.downloadURL}}
                />
                <View style={{ marginTop: -50, marginHorizontal: 10, backgroundColor: '#bce3e8', borderBottomLeftRadius: 30, borderBottomRightRadius: 30, padding: 10, width: windowWidth-40}}>
                  <Text style={{fontSize: 17, fontWeight: 'bold'}}>{item.title}</Text>
                  <Text style={{fontSize: 15, fontWeight: 'bold'}}>{item.startDate}</Text>
                  <Text style={{width: windowWidth - 50, marginBottom: 10}}>{item.location}</Text>
                </View>
            </TouchableOpacity>
          </View> : ""
        )}
      />
    </View> :
    <View style={styles.photoGallery}>
      <FlatGrid
        itemDimension={windowWidth/3}
        data={userPhotos}
        style={styles.gridView}
        spacing={0}
        staticDimension={windowWidth}
        renderItem={({ item }) => (
          <View style={styles.containerImage}>
            <TouchableOpacity onPress={() => 
              props.navigation.navigate("Photoviewer", {photo: item})
              }>
              <Image
                style={styles.photoImage}
                source={{uri: item.downloadURL}}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
    }
    </View>
   </KeyboardAwareScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: windowWidth,
  },
  containerInfo: {
    margin: 20,
  },
  eventGallery: {
    flex: 1,
  },
  photoGallery: {
    flexDirection: 'row',
  },
  containerImage: {
    flex: 1,
  },
  photoImage: {
    flex: 1,
    aspectRatio: 1,
    marginTop: 10,
    width: windowWidth/3,
    height: undefined,
    borderWidth: 0.5,
    borderColor: 'white'
  },
  eventImage: {
    width: windowWidth-40,
    height: windowWidth/2.5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    margin: 10
  },
  containerEvent: {
    flex: 1,
    alignSelf: 'center'
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    marginTop: 10,
    width: windowWidth-50,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#30b5c7",
    padding: 10,
    borderRadius: 30,
    width: 300,
    height: 45,
    justifyContent: 'center',
    marginTop: 5,
  },
  segmentedButton: {
    marginBottom: 10,
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  events: store.userState.events,
  photos: store.userState.photos,
  following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile);