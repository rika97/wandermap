import React, { Component } from 'react'
import { SafeAreaView, View, Image, Text, StyleSheet, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import firebase from 'firebase';

const windowWidth = Dimensions.get('window').width;
const dismissKeyboard = () => { if (Platform.OS != "web"){ Keyboard.dismiss(); } }

export class Login extends Component {
  constructor(props){
    super(props);

    
    this.state = {
      email: '',
      password: '',
    }

    this.onSignIn = this.onSignIn.bind(this)
  }

  onSignIn(){
    const { email, password } = this.state;
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then((result) => {
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
                    source={require('../assets/LoginHeader.png')}
                />
                <View style={styles.inputContainer}>
                    <TextInput 
                      label="Email"
                      style={styles.textInput}
                      onChangeText={(email) => this.setState({ email })}
                    />
                    <TextInput 
                      label="Password"
                      style={styles.textInput}
                      secureTextEntry={true}
                      onChangeText={(password) => this.setState({ password })}
                    />
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => this.onSignIn()}
                    ><Text style={{color: 'white'}}>LOG-IN</Text></TouchableOpacity>
                    </View>
          </SafeAreaView>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    )
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    backgroundColor: "#8abbc2",
    padding: 10,
    borderRadius: 20,
    width: 250,
    height: 45,
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 200,
  },
});

export default Login