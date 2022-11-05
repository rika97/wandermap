import LandingScreen from './screens/Landing'
import RegisterScreen from './screens/Register'
import LoginScreen from './screens/Login'
import MainScreen from './screens/Main'
import PhotoScreen from './screens/Photo'
import SearchScreen from './screens/Search'
import ProfileScreen from './screens/Profile'
import EventviewerScreen from './screens/Eventviewer'
import PhotoviewerScreen from './screens/Photoviewer'
import CreateeventScreen from './screens/Createevent'
import AddeventScreen from './screens/Addevent'
import AddphotoScreen from './screens/Addphoto'

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

import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();

const firebaseConfig = {
  
};

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}

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
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} 
              options={{
                title: 'WanderMap',
                headerStyle: {
                  backgroundColor: '#30b5c7',
                },
                headerTintColor: '#47515F',
              }}
            />
            <Stack.Screen name="Photo" component={PhotoScreen} 
              options={{
                title: 'Camera',
                headerStyle: {
                  backgroundColor: '#30b5c7',
                },
                headerTintColor: '#47515F',
                headerBackTitle: 'Back',
                headerShown: false
              }}
            />
            <Stack.Screen name="Search" component={SearchScreen}
              options={{
                title: 'Search',
                headerStyle: {
                  backgroundColor: '#30b5c7',
                },
                headerTintColor: '#47515F',
                headerBackTitle: 'Back',
              }}/>
            <Stack.Screen name="Createevent" component={CreateeventScreen} navigation={this.props.navigation} 
            options={{
              title: 'Create Event',
              headerStyle: {
                backgroundColor: '#30b5c7',
              },
              headerTintColor: '#47515F',
              headerBackTitle: 'Back',
            }}/>
            <Stack.Screen name="Addevent" component={AddeventScreen} navigation={this.props.navigation}
            options={{
              title: 'Create Event',
              headerStyle: {
                backgroundColor: '#30b5c7',
              },
              headerTintColor: '#47515F',
              headerBackTitle: 'Back',
            }}/>
            <Stack.Screen name="Profile" component={ProfileScreen} navigation={this.props.navigation}
            options={{
              title: 'User Profile',
              headerStyle: {
                backgroundColor: '#30b5c7',
              },
              headerTintColor: '#47515F',
              headerBackTitle: 'Back',
            }} />
            <Stack.Screen name="Eventviewer" component={EventviewerScreen} navigation={this.props.navigation}
            options={{
              title: 'Event',
              headerStyle: {
                backgroundColor: '#30b5c7',
              },
              headerTintColor: '#47515F',
              headerBackTitle: 'Back',
            }} />
            <Stack.Screen name="Photoviewer" component={PhotoviewerScreen} navigation={this.props.navigation}
            options={{
              title: 'Photo',
              headerStyle: {
                backgroundColor: '#30b5c7',
              },
              headerTintColor: '#47515F',
              headerBackTitle: 'Back',
            }} />
            <Stack.Screen name="Addphoto" component={AddphotoScreen} navigation={this.props.navigation}
            options={{
              title: 'Add Photo',
              headerStyle: {
                backgroundColor: '#30b5c7',
              },
              headerTintColor: '#47515F',
              headerBackTitle: 'Re-take',
            }} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App