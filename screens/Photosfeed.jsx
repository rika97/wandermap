import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import firebase from 'firebase/app';
require('firebase/firestore');
import { connect } from 'react-redux';

const windowWidth = Dimensions.get('window').width;

function Photosfeed(props) {
  const [photos, setPhotos] = useState([]);
  useEffect(() => {
    let photos = [];
    if(props.usersLoaded == props.following.length){
        for(let i = 0; i < props.following.length; i++) {
            const user = props.users.find(element => element.uid === props.following[i])
            
            if(user != undefined) {
                photos = [...photos, ...user.photos]
            }
        }
        photos.sort(function(x,y) {
            return y.creation - x.creation;
        })

        setPhotos(photos);
    }
  }, [props.usersLoaded])

  const timestampToDate = (timestamp) => {
    let hours = Math.floor((new Date() - timestamp.toDate())/1000/3600);
    if (hours < 2) {
      return hours + " hour ago"
    } else if (hours < 24) {
      return hours + " hours ago"
    } else {
      return  Math.floor((new Date() - timestamp.toDate())/1000/3600/24) + " days ago"
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.containerGallery}>
        { (photos.length !== 0) ? 
          <FlatList
          numColumns={1}
          horizontal={false}
          data={photos}
          renderItem={({item}) => (
            <View style={styles.containerImage}>
              <TouchableOpacity onPress={() => 
                props.navigation.navigate("Profile", {uid: item.user.uid})
                } style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Image
                  style={styles.profilePic}
                  source={{uri: item.user.downloadURL}}
                />
                <Text style={{fontWeight: 'bold', marginTop: 8, marginLeft: 5}}>{item.user.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => 
                  props.navigation.navigate("Map")
                  }>
                  <Text style={{marginLeft: 5}}>{item.location}</Text>
              </TouchableOpacity>
              <Image
                style={styles.image}
                source={{uri: item.downloadURL}}
                />
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <TouchableOpacity onPress={() => 
                  props.navigation.navigate("Profile", {uid: item.user.uid})
                  } style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                  <Text style={{fontWeight: 'bold', marginLeft: 5, marginRight: 5}}>{item.user.name}</Text>
                </TouchableOpacity>
                <Text>{item.caption}</Text>
              </View>
              <Text style={{marginLeft: 5, fontSize: 12}}>{timestampToDate(item.creation)}</Text>
            </View>
          )}
        /> :
        <View style={{backgroundColor: '#30b5c7'}}>
          <Image
            style={styles.headerImage}
            source={require('../assets/NoFollowing.png')}
          />
        </View>
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
    overflow: 'hidden',
    marginBottom: 10
  },
  image: {
    // flex: 1,
    aspectRatio: 1,
    width: windowWidth,
    height: windowWidth,
  },
  profilePic: {
    width: 35,
    height: 35
  },
  headerImage: {
    width: windowWidth,
    height: undefined,
    aspectRatio: 1324 / 1254,
  },
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Photosfeed);