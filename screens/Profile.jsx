import React from 'react';
import { StyleSheet, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';

const Profile = () => {
  return (
    <View style={styles.container}>
      <StatusBar />
      <Header title={"Profile"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#94c8d4',
  },
});


export default Profile