import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native';
import firebase from 'firebase/app'
require('firebase/firestore')
import { connect } from 'react-redux'

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

  
  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={events}
          renderItem={({item}) => (
            <View style={styles.containerImage}>
              <Text style={styles.container}>{item.user.name}</Text>
              <Image
                style={styles.image}
                source={{uri: item.downloadURL}}
              />
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
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1,
  },
  image: {
    flex: 1,
    aspectRatio: 1,
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Eventsfeed);