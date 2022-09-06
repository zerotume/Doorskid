import { csrfFetch } from "./csrf";


const GET_CHANNELMESSAGES = 'channelmessages/GET_CHANNELMESSAGES';
const CREATE_CHANNELMESSAGES = 'channelmessages/CREATE_CHANNELMESSAGES';
const EDIT_CHANNELMESSAGES = 'channelmessages/EDIT_CHANNELMESSAGES';
const DELETE_CHANNELMESSAGES = 'channelmessages/DELETE_CHANNELMESSAGES';

const getChannelmessageAction = channelmessages => ({
    type:GET_CHANNELMESSAGES,
    channelmessages
});

const createChannelmessageAction = channelmessage => ({
    type:CREATE_CHANNELMESSAGES,
    channelmessage
});

const editChannelmessageAction = channelmessage => ({
    type:EDIT_CHANNELMESSAGES,
    channelmessage
});

const deleteChannelmessageAction = id => ({
    type:DELETE_CHANNELMESSAGES,
    id
});

export const getChannelmessagesThunk = channelId => async dispatch => {
    const response = await csrfFetch(`/api/channels/${channelId}/messages`, {
        herders: {
            'Content-Type':'application/json'
        }
    });

    if(response.ok){
        const channelmessages = await response.json();
        dispatch(getChannelmessageAction(channelmessages));
        return null;
    } else {
        const data = await response.json();
        return data.errors;
    }
}

export default function channelmessageReducer(state = {}, action){
    switch(action.type){
        case GET_CHANNELMESSAGES:{
            console.log(action);
            const newState = {};
            action.channelmessages.forEach(m => {
                newState[m.id] = m;
            });
            newState.channelmessageList = [...action.channelmessages].sort((a,b) => a.id-b.id);
            return newState;
        }
        default:
            return state;
    }
}
