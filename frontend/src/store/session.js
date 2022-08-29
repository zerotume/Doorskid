
import { csrfFetch } from "./csrf";


const LOGIN_SESSION = 'session/loginSession';
const LOGOUT_SESSION = 'session/logoutSession'

const loginSession = (user) => {
    return {
        type:LOGIN_SESSION,
        user
    };
}

const logoutSession = () => {
    return{
        type:LOGOUT_SESSION
    };
}

export const restoreSession = () => async dispatch => {
    const response = await fetch('/api/session');

    if(response.ok){
        const obj = await response.json();
        console.log(obj.user);
        dispatch(loginSession(obj.user));
        return response;
    }
}

export const signupAction = (user) => async dispatch => {
    const response = await csrfFetch('/api/users',{
        method:"POST",
        body: JSON.stringify({...user})
    });

    if(response.ok){
        const obj = await response.json();
        dispatch(loginSession(obj.user));
        return response;
    }
}



export const loginAction = (user) => async dispatch => {
    const {credential, password} = user;
    const response = await csrfFetch('/api/session', {
        method:'POST',
        body: JSON.stringify({credential, password})
    });

    const obj = await response.json();
    dispatch(loginSession(obj.user));
    return response;
}

export const logoutAction = () => async dispatch => {
    const response = await csrfFetch('/api/session',{
        method:'DELETE'
    });
    if(response.ok){
        dispatch(logoutSession());
        return response;
    }
}

const initialState = {user:null};

const sessionReducer = (state = initialState, action) => {
    let newState = {...state};
    switch(action.type){
        case LOGIN_SESSION:
            newState.user = action.user;
            return newState;
        case LOGOUT_SESSION:
            newState.user = null;
            return newState;
        default:
            return state;
    }
}

export default sessionReducer;
