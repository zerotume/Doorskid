import { csrfFetch } from "./csrf";

const GET_CHANNELS = 'channels/GET_CHANNELS';
const CREATE_CHANNEL = 'channels/CREATE_CHANNEL';
const EDIT_CHANNEL = 'channels/EDIT_CHANNEL';
const DELETE_CHANNEL = 'channels/DELETE_CHANNEL'

const getChannelAction = channels => ({
    type:GET_CHANNELS,
    channels
});

const createChannelAction = channel => ({
    type:CREATE_CHANNEL,
    channel
});

const editChannelAction = channel => ({
    type:EDIT_CHANNEL,
    channel
});

const deleteChannelAction = id => ({
    type:DELETE_CHANNEL,
    id
});

export const getChannelsThunk = serverId => async dispatch => {
    const response = await csrfFetch(`/api/servers/${serverId}/channels`, {
        herders: {
            'Content-Type':'application/json'
        }
    });

    if(response.ok){
        const channels = await response.json();
        dispatch(getChannelAction(channels));
        return null;
    } else {
        const data = await response.json();
        return data.errors;
    }
}

export const createChannelThunk = (serverId,payload) => async dispatch => {
    const response = await csrfFetch(`/api/servers/${serverId}/channels`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        const newChannel = await response.json();
        dispatch(createChannelAction(newChannel));
        return null;
    }else{
        const data = await response.json();
        return data.errors;
    }
}

export const editChannelThunk = channel => async dispatch => {
    const response = await csrfFetch(`/api/channels/${channel.id}`, {
        method: 'PUT',
    body: JSON.stringify(channel),
    headers: {'Content-Type': 'application/json'},
    });

    if (response.ok) {
        const channel = await response.json();
        dispatch(editChannelAction(channel));
        return null
    }else{
        const data = await response.json();
        return  data.errors;
    }
}

export const deleteChannelThunk = id => async dispatch => {
    const response = await csrfFetch(`/api/channels/${id}`, {
        method:'DELETE'
    });

    if (response.ok){
        const deleted = await response.json();
        dispatch(deleteChannelAction(id));
        return deleted;
    } else {
        const data = await response.json();
        return data.errors;
    }
}

export default function channelReducer(state = {}, action){
    switch(action.type){
        case GET_CHANNELS:{
            const newState = {};
            action.channels.forEach(channel => {
                newState[channel.id] = newState
            });
            newState.channelList = [...action.channels].sort((a,b) => a.id-b.id);
            return newState;
        }
        case CREATE_CHANNEL:
        case EDIT_CHANNEL:{
            const newState = {...state};
            const oldState = {...state};
            newState[action.channel.id] = action.channel;
            oldState[action.channel.id] = action.channel;
            delete oldState.channelList;
            newState.channelList = Object.values(oldState).sort((a,b) => a.id-b.id);
            return newState;
        }
        case DELETE_CHANNEL:{
            const newState = {...state};
            const oldState = {...state};
            delete newState[action.id];
            delete oldState[action.id];
            newState.channelList = Object.values(oldState).sort((a,b) => a.id-b.id);
        }
        default:
            return state;
    }
}
