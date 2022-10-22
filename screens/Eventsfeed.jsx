import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import firebase from 'firebase/app';
require('firebase/firestore');
import { connect } from 'react-redux';

const windowHeight = Dimensions.get('window').height;

function Eventsfeed(props) {
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
  console.log("Eventsfeed", props)
  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        { (events.length !== 0) ? 
          <FlatList
          numColumns={1}
          horizontal={false}
          data={events}
          renderItem={({item}) => (
            <View style={styles.containerImage}>
              <TouchableOpacity onPress={() => 
                props.navigation.navigate("Profile", {uid: item.user.uid})
                }>
                <Image
                  style={styles.profilePic}
                  source={{uri: item.user.downloadURL}}
                />
                <Text style={{fontSize: 17, marginTop: 5}}>{item.user.name}</Text>
              </TouchableOpacity>
              <Text>{item.location}</Text>
              <Text>{item.startDate}</Text>
              <TouchableOpacity onPress={() => 
                props.navigation.navigate("Eventviewer", {event: item, profilePic: item.user.downloadURL})
                }>
                <Image
                style={styles.image}
                source={{uri: item.downloadURL}}
                />
              </TouchableOpacity>
            </View>
          )}
        /> :
        <Text>No events available.</Text>
      }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    width: windowHeight/6,
    height: windowHeight/6,
    overflow: 'hidden',
  },
  image: {
    // flex: 1,
    aspectRatio: 1,
  },
  profilePic: {
    width: 20,
    height: 20
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Eventsfeed);