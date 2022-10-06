import{ USERS_DATA_STATE_CHANGE, USERS_EVENTS_STATE_CHANGE, CLEAR_DATA } from '../constants/index';

const initialState = {
    users: [],
    usersLoaded: 0,
}

export const users = (state = initialState, action) => {
    switch(action.type){
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                currentUser: [...state.users, action.user]
            }
        case USERS_EVENTS_STATE_CHANGE:
            return {
                ...state,
                usersLoaded: state.usersLoaded + 1,
                users: state.users.map(user => user.uid === action.uid ? 
                    
                    {...user, events: action.events} : user)
            }
        case CLEAR_DATA:
            return {
                users: [],
                usersLoaded: 0
            }
        default:
            return state
    }
}