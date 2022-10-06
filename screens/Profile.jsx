import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native';
import firebase from 'firebase/app'
require('firebase/firestore')
import { connect } from 'react-redux'

function Profile(props) {
  const [userEvents, setUserEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    const { currentUser, events } = props

    if(props.route.params.uid === firebase.auth().currentUser.uid){
      setUser(currentUser)
      setUserEvents(events)
    } else {
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
          setUserEvents(events)
      })
    }

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
  const onLogout = () => {
    firebase.auth().signOut();
  }
  if(user === null) {
    return <View></View>
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{user.name}</Text>
        <Text>{user.email}</Text>

        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
          <View>
            {following ? (
              <Button
                title="Following"
                onPress={() => onUnfollow()}
              />
            ):
            (
              <Button
                title="Follow"
                onPress={() => onFollow()}
              />
            )
            }
          </View>
        ) : 
            <Button
            title="Logout"
            onPress={() => onLogout()}
          />}
      </View>
      
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
  events: store.userState.events,
  following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile);