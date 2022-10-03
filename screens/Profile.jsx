import React from 'react';
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';

import { connect } from 'react-redux'

function Profile(props) {
  const { currentUser, events } = props
  console.log({currentUser, events})
  return (
    <View style={styles.container}>
      <View style={styles.containerInfo}>
        <Text>{currentUser.name}</Text>
        <Text>{currentUser.email}</Text>
      </View>
      
      <View style={styles.containerGallery}>
        <FlatList
          numColumns={1}
          horizontal={false}
          data={events}
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
    marginTop: 40,
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
  events: store.userState.events
})

export default connect(mapStateToProps, null)(Profile);