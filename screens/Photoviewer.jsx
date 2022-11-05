import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';

import { connect } from 'react-redux';

const windowWidth = Dimensions.get('window').width;

const Photoviewer = (props) => {
  const photo = props.route.params.photo
  const [user, setUser] = useState(null);
  useEffect(() => {
    const { currentUser } = props
    setUser(currentUser)

  }, []);

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
    <View style={styles.container}>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 5, marginBottom: 5, marginTop: 10}}>
          <Image
            style={styles.profilePic}
            source={{uri: props.currentUser.downloadURL}}
          />
          <Text style={{fontWeight: 'bold', marginTop: 8, marginLeft: 5}}>{photo.creator}</Text>
        </View>

        <Image
            style={styles.image}
            source={{uri: photo.downloadURL}}
        />
        <Text style={{fontSize: 18, marginLeft: 5, fontWeight: 'bold'}}>{photo.caption}</Text>
        <Text style={{fontSize: 14, marginLeft: 5}}>{photo.location}</Text>
        <Text style={{marginLeft: 5, fontSize: 12}}>{timestampToDate(photo.creation)}</Text>
    </View>
  )};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  touchableButton: {
    alignItems: "center",
    backgroundColor: "#8abbc2",
    padding: 10,
    borderRadius: 20,
    width: 300,
    height: 45,
    justifyContent: 'center',
    marginTop: 5,
    marginBottom:30,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profilePic: {
    width: 35,
    height: 35,
  },
  image: {
    aspectRatio: 1,
    width: windowWidth,
    height: undefined
  },
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps, null)(Photoviewer);