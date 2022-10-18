import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity, Dimensions } from 'react-native';
import firebase from 'firebase/app';
require('firebase/firestore');
import { connect } from 'react-redux';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Account = (props) => {
  const [userEvents, setUserEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { currentUser, events } = props

    setUser(currentUser)
    setUserEvents(events)

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
      <Text style={{fontSize: 20}}>My Events</Text>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={userEvents}
          renderItem={({item}) => (
            <View style={styles.containerImage}>
              <Image
                style={styles.image}
                source={{uri: item.downloadURL}}
              />
              <Text>{item.title}</Text>
              <Text>{item.location}</Text>
            </View>
          )}
        />
      </View>
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
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  events: store.userState.events,
})

export default connect(mapStateToProps, null)(Account);