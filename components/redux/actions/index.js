import { USER_STATE_CHANGE, USER_EVENTS_STATE_CHANGE, USER_PHOTOS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_EVENTS_STATE_CHANGE, USERS_PHOTOS_STATE_CHANGE, CLEAR_DATA } from '../constants/index'
import firebase from 'firebase/app'
require('firebase/firestore')

export function clearData() {
    return ((dispatch) => {
        dispatch({type: CLEAR_DATA})
    })
}
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

export function fetchUserPhotos(){
    return((dispatch) => {
        firebase.firestore()
            .collection("photos")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPhotos")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let photos = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data}
                })
                dispatch({ type: USER_PHOTOS_STATE_CHANGE, photos })
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
                for(let i = 0; i < following.length; i++) {
                    dispatch(fetchUsersData(following[i]));
                }
            })
    })
}

export function fetchUsersData(uid){
    return((dispatch, getState) => {
        const found = getState().usersState.users.some(element => element.uid === uid)

        if(!found){
            firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((snapshot) => {
                if(snapshot.exists){
                    let user = snapshot.data();
                    user.uid = snapshot.id;

                    dispatch({ type: USERS_DATA_STATE_CHANGE, user })
                    dispatch(fetchUsersFollowingEvents(user.uid))
                    dispatch(fetchUsersFollowingPhotos(user.uid))

                } else {
                    console.log("User doesn't exist.")
                }
            })
        }
    })
}

export function fetchUsersFollowingEvents(uid){
    return((dispatch, getState) => {
        firebase.firestore()
            .collection("events")
            .doc(uid)
            .collection("userEvents")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                const uid = snapshot._.query.C_.path.segments[1]

                const user = getState().usersState.users.find(element => element.uid === uid)

                let events = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data, user }
                })
                dispatch({ type: USERS_EVENTS_STATE_CHANGE, events, uid })
            })
    })
}

export function fetchUsersFollowingPhotos(uid){
    return((dispatch, getState) => {
        firebase.firestore()
            .collection("photos")
            .doc(uid)
            .collection("userPhotos")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                const uid = snapshot._.query.C_.path.segments[1]

                const user = getState().usersState.users.find(element => element.uid === uid)

                let photos = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return{id, ...data, user }
                })
                dispatch({ type: USERS_PHOTOS_STATE_CHANGE, photos, uid })
            })
    })
}