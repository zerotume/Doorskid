import { csrfFetch } from "./csrf";

const GET_SERVERS = 'servers/GET_SERVERS';
const CREATE_SERVER = 'servers/CREATE_SERVER';
const EDIT_SERVER = 'servers/EDIT_SERVER';
const DELETE_SERVER = 'servers/DELETE_SERVER';

const getServerAction = servers => ({
    type:GET_SERVERS,
    servers
})

const createServerAction = server => ({
    type:CREATE_SERVER,
    server
})

const editServerAction = server => ({
    type:EDIT_SERVER,
    server
})

const deleteServerAction = id => ({
    type:DELETE_SERVER,
    id
})

export const getServersThunk = () => async dispatch => {
    const response = await csrfFetch('/api/servers/', {
        herders: {
            'Content-Type':'application/json'
        }
    });

    if(response.ok){
        const servers = await response.json();
        dispatch(getServerAction(servers));
        return null;
    } else {
        const data = await response.json();
        return data.errors;
    }
}

export const createServerThunk = payload => async dispatch => {
    const response = await csrfFetch('/api/servers/', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        const newServer = await response.json();
        dispatch(createServerAction(newServer));
        return null;
    }else{
        const data = await response.json();
        return data.errors;
    }
}

export const editServerThunk = server => async dispatch => {
    const response = await csrfFetch(`/api/servers/${server.id}`, {
        method: 'PUT',
    body: JSON.stringify(server),
    headers: {'Content-Type': 'application/json'},
    });

    if (response.ok) {
        const server = await response.json();
        dispatch(editServerAction(server));
        return null
    }else{
        const data = await response.json();
        return  data.errors;
    }
}

export const deleteServerThunk = id => async dispatch => {
    const response = await csrfFetch(`/api/servers/${id}`, {
        method:'DELETE'
    });

    if (response.ok){
        const deleted = await response.json();
        dispatch(deleteServerAction(id));
        return deleted;
    } else {
        const data = await response.json();
        return data.errors;
    }
}

export default function serverReducer(state = {}, action){
    switch(action.type){
        case GET_SERVERS:{
            const newState = {};
            action.servers.forEach(server => {
                newState[server.id] = server
                server.Channels = server.Channels.sort((a,b) => a.id-b.id);
            });
            newState.serverList = [...action.servers].sort((a,b) => a.id-b.id);
            return newState;
        }
        case CREATE_SERVER:
        case EDIT_SERVER:{
            const newState = {...state};
            const oldState = {...state};
            newState[action.server.id] = action.server;
            oldState[action.server.id] = action.server;
            delete oldState.serverList;
            newState.serverList = Object.values(oldState).sort((a,b) => a.id-b.id);
            return newState;
        }
        case DELETE_SERVER:{
            const newState = {...state};
            const oldState = {...state};
            delete newState[action.id];
            delete oldState[action.id];
            newState.serverList = Object.values(oldState).sort((a,b) => a.id-b.id);
        }
        default:
                return state;
    }
}
