import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { Searchbar } from 'react-native-paper';

import firebase from 'firebase/app'
require('firebase/firestore');

const windowHeight = Dimensions.get('window').height;

const Search = (props) => {
  const [ users, setUsers ] = useState([])
  const [ searchValue, setSearchValue ] = useState("")

  const fetchUsers = (search) => {
    if (search=="") {
      setUsers([])
    } else {
      firebase.firestore()
      .collection('users')
      .where('name', '>=', search)
      .where('name', '<=', search + '\uf8ff')
      .get()
      .then((snapshot) => {
        let users = snapshot.docs.map(doc => {
          const data = doc.data();
          const id = doc.id;
          return{id, ...data}
        });
        setUsers(users)
      })
    }
  };
  return (
      <View>
        <Searchbar
          placeholder="Search User"
          onChangeText={ (search)=>{
            setSearchValue(search);
            fetchUsers(search);
          } }
          value={searchValue}
          style={{ borderRadius: 30, height:45 }}
        />

        <FlatList
          style={styles.searchResultsContainer}
          numColumns={1}
          horizontal={false}
          data={users}
          renderItem={({item}) => (
            (props.uid !== item.id) ?
            <TouchableOpacity onPress={() => props.navigation.navigate("Profile", {uid: item.id})} style={{flexDirection: "row"}}>
                <Image
                  style={styles.profilePic}
                  source={{uri: item.downloadURL}}
                />
                <Text style={{fontSize: 17, marginTop: 5}}>{item.name}</Text>
            </TouchableOpacity> : ""
          )}
        />
      </View>
  )
};

const styles = StyleSheet.create({
  searchResultsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 35,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  profilePic: {
    width: 35,
    height: 35
  },
});

export default Search