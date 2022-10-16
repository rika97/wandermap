import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';

import firebase from 'firebase/app'
require('firebase/firestore');

const Search = (props) => {
  const [ users, setUsers ] = useState([])
  const [ searchValue, setSearchValue ] = useState("")

  const fetchUsers = (search) => {
    firebase.firestore()
    .collection('users')
    .where('name', '>=', search)
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
  return (
      <View>
        <TextInput
          label="Search User"
          onChangeText={ (search)=>{
            fetchUsers(search);
            setSearchValue(search);
          } }
          mode="outlined"
          value={searchValue}
          right={<TextInput.Icon icon="close-circle" onPress={() => {
            setSearchValue("");
            setUsers([]);
          }}/>}
        />

        <FlatList style={styles.searchResultsContainer}
          numColumns={1}
          horizontal={false}
          data={users}
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                <Text style={{fontSize: 17, marginTop: 5}}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
  )
};

const styles = StyleSheet.create({
  searchResultsContainer: {

  }
});

export default Search