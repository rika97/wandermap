import{ USERS_DATA_STATE_CHANGE, USERS_EVENTS_STATE_CHANGE, USERS_PHOTOS_STATE_CHANGE, CLEAR_DATA } from '../constants/index';

const initialState = {
    users: [],
    usersLoaded: 0,
}

export const users = (state = initialState, action) => {
    switch(action.type){
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users, action.user]
            }
        case USERS_EVENTS_STATE_CHANGE:
            return {
                ...state,
                usersLoaded: state.usersLoaded + 0.5,
                users: state.users.map(user => user.uid === action.uid ? 
                    
                    {...user, events: action.events} : user)
            }
            case USERS_PHOTOS_STATE_CHANGE:
                return {
                    ...state,
                    usersLoaded: state.usersLoaded + 0.5,
                    users: state.users.map(user => user.uid === action.uid ? 
                        
                        {...user, photos: action.photos} : user)
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