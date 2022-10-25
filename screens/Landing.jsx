import React from 'react';
import { Text, Image, Dimensions, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';

import { StatusBar } from 'expo-status-bar';

const windowWidth = Dimensions.get('window').width;

const Landing = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.appContainer}>
        <StatusBar />
        <Image
            style={styles.logo}
            source={require('../assets/LandingLogo.png')}
        />
        <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate("Register")}
        ><Text style={{color: '#30b5c7'}}>SIGN-UP</Text></TouchableOpacity>
        <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Login")}
        ><Text style={{color: '#30b5c7'}}>LOG-IN</Text></TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#30b5c7'
  },
  logo: {
    width: windowWidth,
    height: undefined,
    aspectRatio: 1,
    marginTop: 50,
    marginBottom: -20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#bce3e8",
    padding: 10,
    borderRadius: 20,
    width: 250,
    height: 45,
    justifyContent: 'center',
    marginTop: 15,
  },
})

export default Landing