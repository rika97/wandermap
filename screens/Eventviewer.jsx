import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const windowWidth = Dimensions.get('window').width;

const Eventviewer = (props) => {
  const event = props.route.params.event;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const { currentUser } = props
    setUser(currentUser)

  }, []);

  const timestampFormatter = (timestamp) => {
    var date = new Date(timestamp);
    let month = date.getMonth() + 1;
    let day = date.getDate();

    const getMonthName = (monthNumber) => {
      const date = new Date();
      date.setMonth(monthNumber - 1);
    
      return date.toLocaleString('en-US', { month: 'short' });
    }

    return [getMonthName(month), day]
  };

  return (
    <KeyboardAwareScrollView 
    style={{
        flex: 1,
        backgroundColor: 'white'
    }}
    extraScrollHeight={100}
    >
      <View style={styles.container}>
        <Image
          style={styles.detailImage}
          source={{uri: event.downloadURL}}
        />
        <View style={{marginHorizontal: 10, marginTop: -50, backgroundColor: '#bce3e8', borderRadius: 30, paddingVertical: 20, paddingHorizontal: 10}}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginLeft: 5, marginTop: 5 }}>
            <Image
              style={styles.profileImage}
              source={{uri: event.user?.downloadURL || "https://raw.githubusercontent.com/rika97/wandermap/main/assets/defaultuser-icon.png"}}
            />
            <Text style={{fontWeight: 'bold', marginTop: 8, marginLeft: 5}}>{event.creator}</Text>
          </View>
          <Text style={{fontSize: 25, fontWeight: 'bold', marginTop: 30 }}>{event.title}</Text>
          <Text style={styles.textDetailHeader}>Location:</Text>
          <Text>{event.location}</Text>
          <Text style={styles.textDetailHeader}>Date & Time:</Text>
          <Text>{event.startDate} ~ {event.endDate}</Text>
          <Text style={styles.textDetailHeader}>Price:</Text>
          <Text>{event.price}</Text>
          <Text style={styles.textDetailHeader}>Description:</Text>
          <Text>{event.description}</Text>
        </View>
        <View style={{backgroundColor: "#30b5c7", borderRadius: 30, width: 80, height: 80, position: 'absolute', top: 330, right: 20, alignItems: 'center'}}>
          <Text style={{color: 'white', fontSize: 40}}>{timestampFormatter(event.startDateTimestamp)[1]}</Text>
          <Text style={{color: 'white', fontSize: 16}}>{timestampFormatter(event.startDateTimestamp)[0]}</Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  )};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    width: windowWidth,
    height: undefined,
    aspectRatio: 1
  },
  detailImage: {
    width: windowWidth-20,
    height: windowWidth-20,
    aspectRatio: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    margin: 10
  },
  profileImage: {
    width: 35,
    height: 35,
  },
  textDetailHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 5,
  }
});

const mapStateToProps = (store) => ({
  currentUser: store.userState.currentUser,
})

export default connect(mapStateToProps, null)(Eventviewer);