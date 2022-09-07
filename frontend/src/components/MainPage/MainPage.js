import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, BrowserRouter as Router, useHistory, Switch, Route, useParams, useRouteMatch, Redirect } from "react-router-dom";
import { deleteServerThunk, getServersThunk } from "../../store/servers";
import io from "socket.io-client";
import { getChannelmessagesThunk } from "../../store/channelmessages";
import ProfileButton from "../Navigation/ProfileButton";
import ServerForm from "../ServerForm/ServerForm";
import ChannelForm from "../ChannelForm/ChannelForm";
import { deleteChannelThunk } from "../../store/channels";
import "./MainPage.css";
const SOCKET_IO_URL = process.env.SOCKET_IO_URL || "ws://localhost:3000";
const socket = io(SOCKET_IO_URL);




function MainPage({sessionLoaded}){

    const history = useHistory();

    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const servers = useSelector(state => state.servers);
    // const serverList = useSelector(state => state.servers.serverList);
    const [isLoaded, setIsLoaded] = useState(false);

    const [newServerMessage, setNewServerMessage] = useState({});
    const [newChannelMessage, setNewChannelMessage] = useState({});
    const [showServerEdit, setShowServerEdit] = useState(-1);
    const [showServerCreate, setShowServerCreate] = useState(false);

    let {path, url} = useRouteMatch();
    let realUrl = window.location.href.split('/');
    let serverId = realUrl[4];
    let channelId = realUrl[5];


    useEffect(() => {
        dispatch(getServersThunk()).then(() => setIsLoaded(true))
        // if(!isLoaded && !sessionUser) return historys6.push('/');
        socket.on('channelbroadcast', data => {
            if(sessionUser){
                console.log(`User ${sessionUser.id} got new message in server ${data.serverId} channel ${data.channelId}`)
                if(serverId !== data.serverId.toString())setNewServerMessage({...newServerMessage, [data.serverId]:true});
                if(channelId !== data.channelId.toString())setNewChannelMessage({...newChannelMessage, [data.channelId]:true});
            }
        });

        return () => {
            socket.removeAllListeners();
        }
    }, [dispatch, servers?.serverList?.length, sessionUser, serverId, channelId]);

    const deleteClick = id => async e => {
        e.preventDefault();
        const data = await dispatch(deleteServerThunk(id));
        if(data){
            //todo: error handling
            console.log('if data')
        }else{
            console.log('else')
            dispatch(getServersThunk()).then(() => history.replace(``));
            // return <Redirect to="/main" />
            setShowServerCreate(false);
        }
    }

    if(sessionLoaded && !sessionUser) return history.push('/');
    // if(!sessionUser) return history.push('/');
    // let newMessage = {};
    return isLoaded && sessionUser && (

        <Router>
            <div className="main-page-container">
                <div className="server-list">
                    <div className="server-new-container">
                        <button className="server-new-button" onClick={() => setShowServerCreate(true)}>New Server</button>
                        <div className="create-server-show" hidden={!showServerCreate}>
                            <ServerForm formType={"Create Server"} server={{ownerId:sessionUser.id}} setShowServerCreate={setShowServerCreate} sessionLoaded={sessionLoaded} />
                            <button className="close-server-form-button" onClick={() => setShowServerCreate(false)}>Cancel</button>
                        </div>
                    </div>
                    {servers &&
                        servers.serverList &&
                        servers.serverList.length &&
                        servers.serverList.map(e => (
                            <div className="server-item-container">
                                <span className="server-item-unread" hidden={!newServerMessage[e.id] || serverId===e.id.toString()}>*</span>
                                <Link className="server-item-link" onClick={() => setNewServerMessage({...newServerMessage, [serverId]:false})}
                                    to={`${url}/${e.id}/${e.Channels?.length?e.Channels[0].id:"none"}`} > {e.name} |</Link>
                                <button onClick={() => setShowServerEdit(e.id)} disabled={e.ownerId !== sessionUser.id} hidden={e.ownerId !== sessionUser.id}>Edit</button>
                                <button className='server-delete-button' onClick={deleteClick(e.id)} disabled={e.ownerId !== sessionUser.id} hidden={e.ownerId !== sessionUser.id}>Delete</button>
                                <div className="update-server-show" hidden={e.id!==showServerEdit}>
                                    <ServerForm formType={"Edit Server"} server={e} setShowServerEdit={setShowServerEdit} sessionLoaded={sessionLoaded} />
                                    <button className="close-server-form-button" onClick={() => setShowServerEdit(-1)}>Cancel</button>
                                </div>
                                {/* // <button className="server-item-button">{e.name}</button> */}
                            </div>
                        ))}
                    <div className="profile-container">
                        <ProfileButton user={sessionUser} />
                    </div>
                </div>

            </div>

            <Switch>
                <Route exact path={path}>
                    <div className="main-empty-container">
                        <h3>Click a server to see messages!</h3>
                    </div>
                </Route>
                <Route path={`${path}/:serverId/:channelId`}>
                    <ServerChannels servers={servers} path={path} url={url} user={sessionUser} sessionLoaded={sessionLoaded}
                    newServerMessage={newServerMessage} newChannelMessage={newChannelMessage}
                    setNewServerMessage={setNewServerMessage} setNewChannelMessage={setNewChannelMessage}
                    />
                </Route>
            </Switch>

        </Router>
    )
}
function ServerChannels({servers, path, url, user, newServerMessage, newChannelMessage, setNewServerMessage, setNewChannelMessage, sessionLoaded}){

    // console.log(newChannelMessage);
    const history = useHistory();
    const dispatch = useDispatch();
    let {serverId, channelId} = useParams();
    let userId = user.id;
    let channels = [];
    const [isLoaded, setIsLoaded] = useState(false);
    const [content, setContent] = useState('');
    const [showChannelEdit, setShowChannelEdit] = useState(-1);
    const [showChannelCreate, setShowChannelCreate] = useState(false);

    const channelmessages = useSelector(state => state.channelmessages);
    if(channelId !== 'none') channels = servers[serverId].Channels;

    // setNewServerMessage({...newServerMessage, [serverId]:false});
    // if(channelId !== 'none')setNewChannelMessage({...newChannelMessage, [channelId]:false});

    useEffect(() => {
        console.log("rerendered, serverId", serverId);
        setIsLoaded(false);
        setContent('');
        dispatch(getChannelmessagesThunk(channelId)).then(() => setIsLoaded(true))
        // if(!isLoaded && !sessionUser) return history.push('/');
        // console.log(channelmessages)
        socket.on('channelbroadcast', data => {
            console.log(data);
            if(data.serverId.toString() === serverId){
                if(data.channelId.toString() === channelId){
                    dispatch(getChannelmessagesThunk(channelId));
                }
            }
        });

        return () => {
            socket.removeAllListeners();
        }

    }, [dispatch, serverId, channelId, channels.length]);

    if(!serverId){
        history.replace('');
        setContent('')
    }

    // useEffect(() => {
    // },[socket])//useEffect+socket => infinate rerendering?

    // const connectToChannel = () => {

    // }

    socket.emit("join", userId);

    const submitMessage = async e => {
        e.preventDefault();
        const d = new Date();
        const data = {serverId, channelId, content, userId, sendTime:d.getTime()};
        socket.emit("channelmessage", data);
        setContent('');
        // await dispatch(getChannelmessagesThunk(channelId));
    }

    const editMessage = async e => {

    }

    const deleteMessage = async e => {

    }

    // console.log("cms", channelmessages)
    let messages = null;
    if(isLoaded && channelmessages && channelmessages.channelmessageList && channelmessages.channelmessageList.length){
        messages = (channelmessages.channelmessageList.map(e => (
            <div className="single-message-container">
                <div className=""></div>
                <div className="message-sender-container">{e.User.firstName} {e.User.lastName}</div>
                <div className="message-content-container">{e.content}</div>
            </div>
        )))
    }else{
        messages = (<div></div>);
    }


    console.log(messages);

    const deleteClick = id => async e => {
        e.preventDefault();
        const data = await dispatch(deleteChannelThunk(id));
        if(data.errors){
            //todo: error handling
        }else{
            console.log('here!');
            setShowChannelCreate(false);
            dispatch(getServersThunk()).then(() => history.replace(`/main`));
        }
    }

    const channelItemClick = async e => {
        setIsLoaded(false);
        setNewChannelMessage({...newChannelMessage, [channelId]:false});
        // await dispatch
    }

    return (<div className="channel-list-container">
                {!!channels?.length && (<div className="channel-list">
                    <div className="channel-new-container">
                        <button className="channel-new-button" onClick={() => setShowChannelCreate(true)} disabled={servers[serverId].ownerId !== user.id} hidden={servers[serverId].ownerId !== user.id}>New Channel</button>
                        <div className="create-channel-show" hidden={!showChannelCreate}>
                            <ChannelForm formType={"Create Channel"} channel={{serverId:serverId}} setShowChannelCreate={setShowChannelCreate} sessionLoaded={sessionLoaded} />
                            <button className="close-channel-form-button" onClick={() => setShowChannelCreate(false)}>Cancel</button>
                        </div>
                    </div>

                        {channels.map(c => (
                            <div className="channel-item-container">
                                <span className="channel-item-unread" hidden={!newChannelMessage[c.id] || c.id.toString() === channelId}>*</span>
                                <Link className="channel-item-link" onClick={channelItemClick}
                                    to={`${url}/${serverId}/${c.id}`} > {c.name} |</Link>
                                <button onClick={() => setShowChannelEdit(c.id)} disabled={servers[serverId].ownerId !== user.id} hidden={servers[serverId].ownerId !== user.id}>Edit</button>
                                <button className='channel-delete-button' onClick={deleteClick(c.id)} disabled={servers[serverId].ownerId !== user.id} hidden={servers[serverId].ownerId !== user.id}>Delete</button>
                                <div className="update-channel-show" hidden={c.id!==showChannelEdit}>
                                    <ChannelForm formType={"Edit Channel"} channel={c} setShowChannelEdit={setShowChannelEdit} sessionLoaded={sessionLoaded} />
                                    <button className="close-server-form-button" onClick={() => setShowChannelEdit(-1)}>Cancel</button>
                                </div>
                            </div>
                        ))}
                </div>)}
                <div className="messages-whole-container">
                    <div className="channel-header">
                        <h3>
                            Server {serverId} Channel {channelId}
                        </h3>
                    </div>
                    <div className="messages-container">
                        {isLoaded && messages}
                    </div>
                    <div className="message-form-container">
                        <form className="message-form">
                            <div className='message-form-label'>
                                <label>
                                Message:
                                </label>
                                <input
                                    type="text"
                                    disabled={channelId === 'none'}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                />
                            </div>
                            <button onClick={submitMessage} disabled={channelId === 'none'}>submit</button>
                        </form>
                    </div>
                </div>
            </div>)
}

export default MainPage;
