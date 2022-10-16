import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Button, TouchableOpacity, Dimensions } from 'react-native';
import firebase from 'firebase/app';
require('firebase/firestore');
import { connect } from 'react-redux';

const windowWidth = Dimensions.get('window').width;

const Profile = (props) => {
  const [userEvents, setUserEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [following, setFollowing] = useState(false);

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
          setUserEvents(events)
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
  }
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text style={{fontSize: 20}}>{user.name}</Text>
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
      
      <Text style={{fontSize: 20}}>Events</Text>
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
    alignItems: 'center',
    width: windowWidth,
  },
  containerInfo: {
    margin: 20,
  },
  containerGallery: {
    flex: 1,
  },
  containerImage: {
    flex: 1,
    alignItems: 'center'
  },
  image: {
    flex: 1,
    aspectRatio: 1,
    marginTop: 10,
    width: windowWidth-50,
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
  following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile);