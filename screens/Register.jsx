import React, { Component } from 'react'
import { SafeAreaView, View, Image, StyleSheet, Dimensions, TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard, Platform, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import firebase from 'firebase';

const windowWidth = Dimensions.get('window').width;
const dismissKeyboard = () => { if (Platform.OS != "web"){ Keyboard.dismiss(); } }

export class Register extends Component {
  constructor(props){
    super(props);

    
    this.state = {
      email: '',
      password: '',
      name: '',
      downloadURL: 'https://raw.githubusercontent.com/rika97/wandermap/main/assets/defaultuser-icon.png',
    }

    this.onSignUp = this.onSignUp.bind(this)
  }

  onSignUp(){
    const { email, password, name, downloadURL } = this.state;
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((result) => {
      firebase.firestore().collection("users")
        .doc(firebase.auth().currentUser.uid)
        .set({
          name,
          email,
          downloadURL,
        })
      console.log(result)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  render() {
    return (
      <KeyboardAwareScrollView 
                    style={{
                        flex: 1,
                        backgroundColor: 'white'
                    }}
                    extraScrollHeight={100}
                    >
        <TouchableWithoutFeedback onPress={() => dismissKeyboard()} accessible={false}>
          <SafeAreaView style={styles.appContainer}>
            <Image
                style={styles.headerImage}
                source={require('../assets/RegisterHeader.png')}
            />
            <View style={styles.inputContainer}>
              <TextInput 
                placeholder="Name"
                style={styles.textInput}
                onChangeText={(name) => this.setState({ name })}
              />
              <TextInput 
                placeholder="Email"
                style={styles.textInput}
                onChangeText={(email) => this.setState({ email })}
              />
              <TextInput 
                placeholder="Password"
                secureTextEntry={true}
                style={styles.textInput}
                onChangeText={(password) => this.setState({ password })}
              />
              <TouchableOpacity
                  style={styles.button}
                  onPress={() => this.onSignUp()}
              ><Text style={{color: 'white'}}>SIGN-UP</Text></TouchableOpacity>
            </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    )
  }
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#30b5c7',
  },
  inputContainer: {
    backgroundColor: 'white',
    width: windowWidth,
    alignItems: "center",
  },
  headerImage: {
    width: windowWidth,
    height: undefined,
    aspectRatio: 1324 / 1254,
  },
  textInput: {
    width: windowWidth-80,
    marginTop: 10,
    backgroundColor: "#cfe3e6",
    borderRadius: 30,
    fontSize: 16,
    padding: 20,
    marginHorizontal: 15,
    height: 55,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#8abbc2",
    padding: 10,
    borderRadius: 30,
    width: 250,
    height: 45,
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 100,
  },
});

export default Register