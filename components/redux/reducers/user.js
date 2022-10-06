import{ USER_STATE_CHANGE, USER_EVENTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, CLEAR_DATA } from '../constants/index';

const initialState = {
    currentUser: null,
    events: [],
    following: [],
}

export const user = (state = initialState, action) => {
    switch(action.type){
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_EVENTS_STATE_CHANGE:
            return {
                ...state,
                events: action.events
            }
        case USER_FOLLOWING_STATE_CHANGE:
        return {
            ...state,
            following: action.following
        }
        case CLEAR_DATA:
            return {
                currentUser: null,
                events: [],
                following: []
            }
        default:
            return state
    }
}