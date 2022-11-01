import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import firebase from 'firebase/app';
require('firebase/firestore');
import { connect } from 'react-redux';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
console.log(windowHeight, windowWidth)

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
        { (events.length !== 0) ? 
        <View style={styles.containerGallery}>
          <View styles={{backgroundColor: '#30b5c7'}}>
            <Image
              style={styles.headerImage}
              source={require('../assets/EventsfeedHeader.png')}
            />
          </View>  
          <FlatList
          numColumns={1}
          horizontal={false}
          data={events}
          renderItem={({item}) => (
            <View style={styles.containerImage}>
              <TouchableOpacity onPress={() => 
                props.navigation.navigate("Profile", {uid: item.user.uid})
                }
                style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Image
                  style={styles.profilePic}
                  source={{uri: item.user.downloadURL}}
                />
                <Text style={{fontWeight: 'bold', marginTop: 8, marginLeft: 5}}>{item.user.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => 
                props.navigation.navigate("Eventviewer", {event: item, profilePic: item.user.downloadURL})
                }>
                <Text style={{marginLeft: 5, fontWeight: 'bold', fontSize: 25}}>{item.title}</Text>
                <Text style={{marginLeft: 5, fontSize: 20}}>{item.startDate}</Text>
                <Text style={{marginLeft: 5}}>Location: {item.location}</Text>
                <Image
                style={styles.image}
                source={{uri: item.downloadURL}}
                />
              </TouchableOpacity>
            </View>
          )}
        />
        </View> :
        <View styles={{backgroundColor: '#30b5c7'}}>
          <Image
            style={styles.blankImage}
            source={require('../assets/NoEvents.png')}
          />
        </View>
      }
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
    marginTop: 10,
    overflow: 'hidden',
  },
  image: {
    // flex: 1,
    aspectRatio: 1,
  },
  profilePic: {
    width: 35,
    height: 35,
  },
  blankImage: {
    width: windowWidth,
    height: undefined,
    aspectRatio: 850 / 1294,
    marginTop: 85
  },
  headerImage: {
    width: windowWidth,
    height: undefined,
    aspectRatio: 1518 / 162,
  },
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Eventsfeed);