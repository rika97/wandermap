import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity, Dimensions } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import firebase from 'firebase/app';
require('firebase/firestore');
import { connect } from 'react-redux';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
  }

  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <View>
          <Image
          style={styles.profilePicture}
          source={{
            uri: user.downloadURL,
          }}
          />
          <Text style={{fontSize: 20}}>{user.name}</Text>
        </View>
        <Text>Email: {user.email}</Text>
        <TouchableOpacity 
          style={styles.button}
          // onPress={() => onLogout()}
        ><Text style={{color: 'white'}}>Edit Profile</Text></TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => onLogout()}
        ><Text style={{color: 'white'}}>Sign Out</Text></TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => props.navigation.navigate("Createevent", {user})}
        ><Text style={{color: 'white'}}>Create Event</Text></TouchableOpacity>
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
      <View style={styles.containerGallery}>
      <FlatList
        numColumns={1}
        horizontal={false}
        data={userEvents}
        renderItem={({item}) => (
          <View style={styles.containerImage}>
            <TouchableOpacity onPress={() => 
              props.navigation.navigate("Eventviewer", {event: item, profilePic: props.currentUser.downloadURL })
              }>
              <Text>{item.title}</Text>
              <Image
              style={styles.image}
              source={{uri: item.downloadURL}}
              />
              <Text>{item.startDate}</Text>
              <Text>{item.location}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View> :
    <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={userPhotos}
          renderItem={({item}) => (
            <View style={styles.containerImage}>
              <TouchableOpacity onPress={() => 
                props.navigation.navigate("Photoviewer", {photo: item})
                }>
                <Image
                  style={styles.image}
                  source={{uri: item.downloadURL}}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
  }
      
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: 'center',
    // width: windowWidth,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    width: windowHeight/6,
    height: windowHeight/6,
    overflow: 'hidden',
  },
  profilePicture: {
    width: 80,
    height: 80,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    marginTop: 10,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#8abbc2",
    padding: 10,
    borderRadius: 20,
    width: 300,
    height: 45,
    justifyContent: 'center',
    marginTop: 5,
  },
  segmentedButton: {
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  events: store.userState.events,
  photos: store.userState.photos,
})

export default connect(mapStateToProps, null)(Account);