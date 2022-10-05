import { USER_STATE_CHANGE, USER_EVENTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE } from '../constants/index'
import firebase from 'firebase/app'
import {SnapshotViewIOSComponent} from 'react-native'
require('firebase/firestore')

export function fetchUser(){
    return((dispatch) => {
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    dispatch({ type: USER_STATE_CHANGE, currentUser: snapshot.data() })
                } else {
                    console.log("User doesn't exist.")
                }
            })
    })
}

export function fetchUserEvents(){
    return((dispatch) => {
        firebase.firestore()
            .collection("events")
            .doc(firebase.auth().currentUser.uid)
            .collection("userEvents")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let events = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data}
                })
                dispatch({ type: USER_EVENTS_STATE_CHANGE, events })
            })
    })
}

export function fetchUserFollowing(){
    return((dispatch) => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following })
            })
    })
}