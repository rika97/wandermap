import React, { Component } from 'react';
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from 'firebase/app'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserEvents, fetchUserFollowing, clearData } from '../components/redux/actions/index'

import MapScreen from './Map'
import EventsScreen from './Events'
import CommunityScreen from './Community'
import ProfileScreen from './Profile'
import SearchScreen from './Search'

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return(null)
}

export class Main extends Component {
  componentDidMount(){
    this.props.clearData();
    this.props.fetchUser();
    this.props.fetchUserEvents();
    this.props.fetchUserFollowing();
  }
  render() {
    return (
        <Tab.Navigator initialRouteName='Map' labeled={false}>
            <Tab.Screen name="PhotoContainer" component={EmptyScreen} 
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Photo")
                    }
                })}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="camera" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="magnify" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Community" component={CommunityScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="account-group" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Map" component={MapScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="google-maps" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Events" component={EventsScreen} 
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="calendar-month" color={color} size={26} />
                    ),
                }} />
            <Tab.Screen name="Profile" component={ProfileScreen} 
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
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
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserEvents, fetchUserFollowing, clearData}, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);