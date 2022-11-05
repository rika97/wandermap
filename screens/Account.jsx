import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import { FlatGrid } from 'react-native-super-grid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import firebase from 'firebase/app';
require('firebase/firestore');
import { connect } from 'react-redux';

const windowWidth = Dimensions.get('window').width;

const Account = (props) => {
  const [userEvents, setUserEvents] = useState([]);
  const [userPhotos, setUserPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [segmentedValue, setSegmentedValue] = React.useState('events');

  useEffect(() => {
    const { currentUser, events, photos } = props

    setUser(currentUser)
    setUserEvents(events)
    setUserPhotos(photos)

  }, [])
  const onLogout = () => {
    firebase.auth().signOut();
  }
  if(user === null) {
    return (
      <View>
        <Text>Error: User account doesn't exist.</Text>
      </View>
      )
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
              <View style={{flexDirection: "column"}}>
                <Text style={{fontSize: 20, marginTop: 20, marginLeft: 10, fontWeight: 'bold'}}>Welcome,</Text>
                <Text style={{fontSize: 25, marginTop: 5, marginLeft: 10, fontWeight: 'bold'}}>{user.name}! 👋</Text>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => props.navigation.navigate("Createevent", {user})}
            ><Text style={{color: 'white'}}>Create Event</Text></TouchableOpacity>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => onLogout()}
            ><Text style={{color: 'white'}}>Sign Out</Text></TouchableOpacity>
          </View>
          <SegmentedButtons
            value={segmentedValue}
            onValueChange={setSegmentedValue}
            buttons={[
              {
                value: 'events',
                label: 'My Events',
              },
              {
                value: 'photos',
                label: 'My Photos',
              },
            ]}
            style={styles.segmentedButton}
      />
        { segmentedValue === "events" ? 
        <View style={styles.eventGallery}>
          <Text style={{fontSize: 20, marginTop: 20, fontWeight: 'bold'}}>Upcoming Events</Text>
          <FlatList
            numColumns={1}
            horizontal={false}
            data={userEvents}
            renderItem={({item}) => (
              (item.endDateTimestamp > new Date().getTime()) ?
              <View style={styles.containerEvent}>
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
          <Text style={{fontSize: 20, marginTop: 20, fontWeight: 'bold'}}>Past Events</Text>
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
  containerEvent: {
    flex: 1,
    alignSelf: 'center'
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
  button: {
    alignItems: "center",
    backgroundColor: "#30b5c7",
    padding: 10,
    borderRadius: 30,
    width: 160,
    height: 40,
    justifyContent: 'center',
    marginTop: 5,
    marginHorizontal: 100
  },
  segmentedButton: {
    marginBottom: 10,
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  events: store.userState.events,
  photos: store.userState.photos,
})

export default connect(mapStateToProps, null)(Account);