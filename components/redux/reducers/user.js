import{ USER_STATE_CHANGE, USER_EVENTS_STATE_CHANGE } from '../constants/index';

const initialState = {
    currentUser: null,
    events: []
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
        default:
            return state
    }
}