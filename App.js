import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import React, { Component } from 'react'
import { View, Text } from 'react-native';

import firebase from 'firebase/app'
import "firebase/auth"

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './components/redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))

const firebaseConfig = {
  apiKey: "AIzaSyCsbA0GruKqC1RIf_BbHGwrW7foTWXUVAw",
  authDomain: "wandermap-ec1a0.firebaseapp.com",
  projectId: "wandermap-ec1a0",
  storageBucket: "wandermap-ec1a0.appspot.com",
  messagingSenderId: "784942620400",
  appId: "1:784942620400:web:c4b231276037833e6c6c35",
  measurementId: "G-GJYXYR0HGY"
};

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}

import LandingScreen from './screens/Landing'
import RegisterScreen from './screens/Register'
import LoginScreen from './screens/Login'
import MainScreen from './screens/Main'
import PhotoScreen from './screens/Photo'
import EditeventScreen from './screens/Editevent'
import SaveeventScreen from './screens/Saveevent'
import SearchScreen from './screens/Search'

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      loaded: false,
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user)=> {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if(!loaded){
      return(
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text>Loading</Text>
        </View>
      )
    }

    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Photo" component={PhotoScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="Editevent" component={EditeventScreen} navigation={this.props.navigation} />
            <Stack.Screen name="Saveevent" component={SaveeventScreen} navigation={this.props.navigation} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App