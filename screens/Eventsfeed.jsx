import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

import firebase from 'firebase/app';
require('firebase/firestore');
import { connect } from 'react-redux';

const windowWidth = Dimensions.get('window').width;

function Eventsfeed(props) {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState(null);
  
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
            return x.startDateTimestamp - y.startDateTimestamp;
        })

        setEvents(events);

    }
  }, [props.usersLoaded])

  const daysCalculator = (itemDate) => {
    const time = Math.floor((itemDate-new Date().getTime())/3600/1000/24)
    if (time < 1) {
      return "Today"
    } else if (time < 2) {
      return "in" + time + " day"
    } else {
      return "in" + time + " days"
    }
  }

  return (
    <View style={styles.container}>
        { (events.length !== 0) ? 
        <View style={styles.containerGallery}>
          <View styles={{flexDirection: "row", flex: 1}}>
            <Text style={{fontSize: 25, fontWeight: "bold", marginLeft: 10, marginTop: 10, marginBottom: 5}}>Upcoming Events</Text>
            <TouchableOpacity style={styles.filterButton}>
              <IconButton
                size={20}
                icon="filter-variant"
                iconColor='white'
                style={{marginTop: -7, marginHorizontal: 0 }}
              />
              <View style={{width: 140, marginTop: 2}}>
                <RNPickerSelect
                    placeholder={{label: "All Categories"}}
                    onValueChange={(value) => setCategory(value)}
                    style={{width:40}}
                    items={[
                        { label: 'Music', value: 'music' },
                        { label: 'Food & Drinks', value: 'food' },
                        { label: 'Party', value: 'party' },
                        { label: 'Festival', value: 'festival' },
                        { label: 'Performance', value: 'performance' },
                        { label: 'Screening', value: 'screening' },
                        { label: 'Tournament', value: 'tournament' },
                        { label: 'Networking', value: 'networking' },
                        { label: 'Expo', value: 'expo' },
                        { label: 'Business', value: 'business' },
                        { label: 'Game', value: 'game' },
                        { label: 'Convention', value: 'convention' },
                        { label: 'Seminar', value: 'seminar' },
                        { label: 'Race', value: 'race' },
                        { label: 'Attraction', value: 'attraction' },
                        { label: 'Sports', value: 'sports' },
                        { label: 'Education', value: 'education' },
                        { label: 'Other', value: 'other' },
                    ]}
                />
              </View>
            </TouchableOpacity>
          </View>  
          <FlatList
          numColumns={1}
          horizontal={false}
          data={events}
          renderItem={({item}) => (
            ((item.endDateTimestamp > new Date().getTime()) && ((category == item.category) || (category == null))) ? 
              <TouchableOpacity onPress={() => 
                props.navigation.navigate("Eventviewer", {event: item, profilePic: item.user.downloadURL})
                }
                style={styles.containerEvent}>
                <Image
                style={styles.image}
                source={{uri: item.downloadURL}}
                />
                <View style={{flexShrink: 1, marginLeft: 7, marginRight: 7}}>
                  <View style={{width: 230, padding: 5, backgroundColor: "#30b5c7", alignItems: 'center', borderRadius: 20}}>
                    <Text style={{fontWeight: "bold", fontSize: 17, color: "white"}}>{item.startDate} ({daysCalculator(item.startDateTimestamp)})</Text>
                  </View>
                  <Text style={{fontWeight: 'bold', fontSize: 20, marginTop: 3}}>{item.title}</Text>
                  <Text style={{marginTop: 5}}>{item.location}</Text>
                  <Text style={{fontWeight: 'bold', marginTop: 5}}>Hosted by: {item.user.name}</Text>
                </View>
              </TouchableOpacity> : ""
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
  containerEvent: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    overflow: 'hidden',
    flex: 1,
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#8abbc2"
  },
  image: {
    // flex: 1,
    aspectRatio: 1,
    width: 120,
    height: 120,
    borderRadius: 5,
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
  filterButton: {
    position: 'absolute',
    // right: 0,
    backgroundColor: "#30b5c7",
    padding: 5,
    borderRadius: 30,
    width: 140,
    height: 35,
    position: 'absolute',
    right: 0,
    flexDirection: "row",
    marginRight: 10,
    marginTop: 10,
  }
})

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
  following: store.userState.following,
  users: store.usersState.users,
  usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Eventsfeed);