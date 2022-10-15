import React, { Component } from 'react'
import { SafeAreaView, View, Image, StyleSheet, Dimensions, TouchableOpacity, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import firebase from 'firebase';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export class Register extends Component {
  constructor(props){
    super(props);

    
    this.state = {
      email: '',
      password: '',
      name: '',
    }

    this.onSignUp = this.onSignUp.bind(this)
  }

  onSignUp(){
    const { email, password, name } = this.state;
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((result) => {
      firebase.firestore().collection("users")
        .doc(firebase.auth().currentUser.uid)
        .set({
          name,
          email
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
    width: windowWidth-50,
    marginTop: 15,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#6b4fab",
    padding: 10,
    borderRadius: 20,
    width: 250,
    height: 45,
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 100,
  },
});

export default Register