import React, { Component } from 'react';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import MapScreen from './Map'
import EventsScreen from './Events'
import CommunityScreen from './Community'
import AccountScreen from './Account'

import firebase from 'firebase/app'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserEvents, fetchUserPhotos, fetchUserFollowing, clearData } from '../components/redux/actions/index'

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return(null)
}

export class Main extends Component {
  componentDidMount(){
    this.props.clearData();
    this.props.fetchUser();
    this.props.fetchUserEvents();
    this.props.fetchUserPhotos();
    this.props.fetchUserFollowing();
  }
  render() {
    return (
        <Tab.Navigator initialRouteName='Map' barStyle={{backgroundColor: '#fff', height: 90}}>
            <Tab.Screen name="Camera" component={EmptyScreen} 
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Photo")
                    }
                })}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="camera-marker" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Community" component={CommunityScreen}
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Community", {uid: firebase.auth().currentUser.uid})
                    }
                })}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-group" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Map" component={MapScreen} navigation={this.props.navigation}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="map-marker" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Events" component={EventsScreen} navigation={this.props.navigation}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="calendar-month" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Account" component={AccountScreen} 
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Account", {uid: firebase.auth().currentUser.uid})
                    }
                })}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account" color={color} size={26} />
                    ),
                }} />
        </Tab.Navigator>
        )
  }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserEvents, fetchUserPhotos, fetchUserFollowing, clearData}, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);