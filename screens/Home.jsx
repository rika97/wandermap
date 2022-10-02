import React from 'react';
import { StyleSheet, View } from "react-native";
import { StatusBar } from 'expo-status-bar';
import Header from '../components/Header';
import Map from '../components/Map';

const Home = () => {
  return (
    <View style={styles.container}>
      <StatusBar />
      <Header title={"WanderMap"} />
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#94c8d4',
  },
});


export default Home