import React, { Component }from 'react';
import { StyleSheet, Text, View } from 'react-native';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView from 'react-native-maps';

export default class Map extends Component{
  constructor(props){
    super(props)
    this.state ={
      latitude:null,
      longitude:null,
      message:'Fetching current location...',
    }
  }
  componentDidMount(){
    this.getLocationAsync()
  }
  getLocationAsync = async() =>{
    console.log('Fetching current location')
    const {status} = await Permissions.askAsync(Permissions.LOCATION)
    if(status !== 'granted'){
      this.setState({
        message:'Failed to get current location.'
      })
      return
    }
    const location = await Location.getCurrentPositionAsync({});
    this.setState({
      latitude:location.coords.latitude,
      longitude:location.coords.longitude,
    })

  }
  render(){
    if(this.state.latitude && this.state.longitude){
      return (
        <View style={styles.container}>
          <MapView
            style={{flex:1}}
            initialRegion={{
              latitude:this.state.latitude,
              longitude:this.state.longitude,
              latitudeDelta:0.05,
              longitudeDelta:0.05,
            }}
            region={{
              latitude:this.state.latitude,
              longitude:this.state.longitude,
              latitudeDelta:0.05,
              longitudeDelta:0.05,

            }}
            showsUserLocation={true}
          />
        </View>
      );
    }
    return (
      <View style={{flex:1,justifyContent:"center"}}>
        <Text>{this.state.message}</Text>

      </View>
      )

  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff',
    justifyContent:'center',
  },
  now:{
    position:'absolute',
    right:10,
    top:30,
  }
})
