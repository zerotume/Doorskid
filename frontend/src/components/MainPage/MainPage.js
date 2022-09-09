import { useRef, useState } from "react";
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
import ChannelmessageForm from "../ChannelmessageForm/ChannelmessageForm";
import ProblemPage from "../ProblemPage/ProblemPage";
const REACT_APP_SOCKET_IO_URL = process.env.REACT_APP_SOCKET_IO_URL || "ws://localhost:3000";
const socket = io.connect(REACT_APP_SOCKET_IO_URL, {secure: true});


//console.log('rebuild ohoo123');


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
    const [rerender, setRerender] = useState({});

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

        socket.on("changedRerender", data => {
            setIsLoaded(false);
            dispatch(getServersThunk()).then(() => {
                setIsLoaded(true);
                return setRerender({});
            });
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
            // console.log('if data')
        }else{
            // console.log('else')
            socket.emit("somethingDeleted", {serverId:id});
            dispatch(getServersThunk())
            history.replace(`/main`);
            // return <Redirect to="/main" />
            setShowServerCreate(false);
            return setRerender({});
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
                        <button className="server-new-button" onClick={() => setShowServerCreate(true)}>New Server <i class="fa-solid fa-plus"></i></button>
                        <div className="create-server-show" hidden={!showServerCreate}>
                            <ServerForm socket={socket} setRerender={setRerender} formType={"Create Server"} server={{ownerId:sessionUser.id}} setShowServerCreate={setShowServerCreate} sessionLoaded={sessionLoaded} />
                            <button className="close-server-form-button" onClick={() => setShowServerCreate(false)}>Cancel <i class="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                    {servers &&
                        servers.serverList &&
                        servers.serverList.length > 0 &&
                        servers.serverList.map(e => (
                            <div>
                                <div className="server-item-container">
                                    {/* <span className="server-item-unread" hidden={!newServerMessage[e.id] || serverId===e.id.toString()}>*</span> */}
                                    <Link className="server-item-link" disabled={e.id.toString() === serverId} onClick={() => setNewServerMessage({...newServerMessage, [serverId]:false})}
                                        to={`${url}/${e.id}/${e.Channels?.length?e.Channels[0].id:"none"}`} > {e.name}</Link>
                                    <div className="server-buttons">
                                        <button className="server-edit-button" onClick={() => setShowServerEdit(e.id)} disabled={e.ownerId !== sessionUser.id} hidden={e.ownerId !== sessionUser.id}><i class="fa-solid fa-gear"></i></button>
                                        <button className='server-delete-button' onClick={deleteClick(e.id)} disabled={e.ownerId !== sessionUser.id} hidden={e.ownerId !== sessionUser.id}><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                    {/* // <button className="server-item-button">{e.name}</button> */}
                                </div>
                                <div className="update-server-show" hidden={e.id!==showServerEdit}>
                                    <ServerForm formType={"Edit Server"} server={e} setShowServerEdit={setShowServerEdit} sessionLoaded={sessionLoaded} />
                                    <button className="close-server-form-button" onClick={() => setShowServerEdit(-1)}>Cancel <i class="fa-solid fa-xmark"></i></button>
                                </div>
                            </div>
                        ))}
                </div>
                <div className="profile-container">
                    <ProfileButton user={sessionUser} />
                </div>

            </div>

            <Switch>
                <Route exact path={path}>
                    <div className="main-empty-container">
                        <h2>Welcome to doorskid!</h2>
                        <h2>Click a server to see messages! {servers.serverList.length===0?'It looks empty...maybe try to create a new server?':''}</h2>
                        {servers && (
                            <>
                                <h3>You're currently in {servers.serverList.length} servers. {servers.serverList.length===0?'Try to crete a new server or ask someone to invite you!':''}</h3>
                                <h3>You are the moderator of {servers.serverList.filter(e => e.ownerId === sessionUser.id).length} server.</h3>
                            </>
                        )}
                    </div>
                </Route>
                <Route path={`${path}/:serverId/:channelId`}>
                    <ServerChannels servers={servers} path={path} url={url} user={sessionUser} sessionLoaded={sessionLoaded}
                    newServerMessage={newServerMessage} newChannelMessage={newChannelMessage}
                    setNewServerMessage={setNewServerMessage} setNewChannelMessage={setNewChannelMessage}
                    setRerender={setRerender} outerHistory={history} socket={socket}
                    />
                </Route>
                {/* <Route path='/error'>
                    <ProblemPage />
                </Route> */}
            </Switch>

        </Router>
    )
}
function ServerChannels({servers, path, url, outerHistory, socket, user, newServerMessage, newChannelMessage, setNewServerMessage, setNewChannelMessage, sessionLoaded, setRerender}){

    // console.log(newChannelMessage);
    const history = useHistory();
    const dispatch = useDispatch();
    let {serverId, channelId} = useParams();
    let userId = user.id;
    let channels = [];
    const [isLoaded, setIsLoaded] = useState(false);
    const [content, setContent] = useState('');
    const [showChannelEdit, setShowChannelEdit] = useState(-1);
    const [showChannelmessageEdit, setShowChannelmessageEdit] = useState(-1);
    const [showChannelCreate, setShowChannelCreate] = useState(false);
//maybe channelmessages to empty after every click?
    const channelmessages = useSelector(state => state.channelmessages);
    if(channelId !== 'none') channels = servers[serverId]?.Channels;
    const messageContainer = useRef(null);


    // setNewServerMessage({...newServerMessage, [serverId]:false});
    // if(channelId !== 'none')setNewChannelMessage({...newChannelMessage, [channelId]:false});

    useEffect(() => {
        messageContainer.current.scrollIntoView({behavior:"smooth"});
        console.log("rerendered, serverId", serverId);
        setIsLoaded(false);
        setContent('');
        if(channelId!=='none')dispatch(getChannelmessagesThunk(channelId)).then(() => setIsLoaded(true))
        // if(!isLoaded && !sessionUser) return history.push('/');
        // console.log(channelmessages)
        socket.on('channelbroadcast', data => {
            console.log(data);
            if(data.serverId.toString() === serverId){
                if(data.channelId.toString() === channelId){
                    if(channelId!=='none'){
                        dispatch(getChannelmessagesThunk(channelId));
                        messageContainer.current.scrollIntoView({behavior:"smooth"});//doesn't work
                    }
                }
            }
        });

        socket.on("deleteNotice", data => {
            if(data.serverId.toString() === serverId){
                // if(data.channelId.toString() === channelId){
                    outerHistory.replace('/error')
                // }
            }
        });

        socket.on("changedRerender", data => {
            setIsLoaded(false);
            dispatch(getServersThunk()).then(() => {
                setIsLoaded(true);
                return setRerender({});
            });
        });

        return () => {
            socket.removeAllListeners();
        }

    }, [dispatch, serverId, channelId]);

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

    // const editMessage = id => async e => {

    // }

    const deleteMessage = id => async e => {
        e.preventDefault();
        const data = {msgId:id, serverId, channelId};
        socket.emit("deleteChannelmessage", data);
        // setContent('');
    }

    // console.log("cms", channelmessages)
    let messages = null;
    if(isLoaded && channelmessages && channelmessages.channelmessageList && channelmessages.channelmessageList.length){
        messages = (channelmessages.channelmessageList.map(e => (
            <div>
                <div className="single-message-container">
                    <div className="message-main-container">
                        <div className="message-sender-container">{e.User.firstName} {e.User.lastName}</div>
                        <div className="message-content-container">{e.content}</div>
                    </div>
                    <div className="message-button-container">
                        <button className="message-button message-edit-button"
                            onClick={() => setShowChannelmessageEdit(e.id)}
                            disabled={e.senderId.toString() !== userId.toString()}
                            hidden={e.senderId.toString() !== userId.toString()}>
                                {/* <i class="fa-regular fa-gear"></i> */}
                                <i class="fa-solid fa-pen"></i>
                        </button>
                        <button className="message-button message-delete-button" onClick={deleteMessage(e.id)} disabled={e.senderId.toString() !== userId.toString()} hidden={e.senderId.toString() !== userId.toString()}><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div className="update-message-show" hidden={e.id!==showChannelmessageEdit}>
                    <ChannelmessageForm channelmessage={e}
                            setShowChannelmessageEdit={setShowChannelmessageEdit}
                            sessionLoaded={sessionLoaded} socket={socket}
                            serverId={serverId} channelId={channelId}/>
                    <button className="close-server-form-button" onClick={() => setShowChannelmessageEdit(-1)}>Cancel <i class="fa-solid fa-xmark"></i></button>
                </div>
            </div>
        )))
    }else{
        messages = (<div></div>);
    }

    // if(isLoaded && messages && showChannelmessageEdit===-1)messageContainer.current.scrollIntoView({behavior:"smooth"});

    // console.log(messages);

    const deleteClick = id => async e => {
        e.preventDefault();
        const data = await dispatch(deleteChannelThunk(id));
        if(data.errors){
            //todo: error handling
        }else{
            // console.log('here!');
            socket.emit("somethingDeleted", {serverId, channelId});
            setShowChannelCreate(false);
            dispatch(getServersThunk()).then(() => {
                serverId = null;
                channelId = null;
                history.replace(`/main`)
                return setRerender({});
            });
        }
    }

    const channelItemClick = async e => {
        setIsLoaded(false);
        setNewChannelMessage({...newChannelMessage, [channelId]:false});
        return setRerender({});
        // await dispatch
    }

    return servers[serverId] && (<div className="channel-list-container">
                {(<div className="channel-list">
                    <div className="channel-new-container">
                        <button className="channel-new-button" onClick={() => setShowChannelCreate(true)} disabled={servers[serverId].ownerId !== user.id} hidden={servers[serverId].ownerId !== user.id}>New Channel <i class="fa-solid fa-plus"></i></button>
                        <div className="create-channel-show" hidden={!showChannelCreate}>
                            <ChannelForm socket={socket} setRerender={setRerender} formType={"Create Channel"} channel={{serverId:serverId}} setShowChannelCreate={setShowChannelCreate} sessionLoaded={sessionLoaded} />
                            <button className="close-channel-form-button" onClick={() => setShowChannelCreate(false)}>Cancel <i class="fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                        {!!channels?.length && channels.map(c => (
                            <div>
                                <div className="channel-item-container">
                                    {/* <span className="channel-item-unread" hidden={!newChannelMessage[c.id] || c.id.toString() === channelId}>*</span> */}
                                    <Link className="channel-item-link" onClick={channelItemClick} disabled={c.id.toString() === channelId}
                                        to={`${url}/${serverId}/${c.id}`} > {c.name}</Link>
                                    <div className="channel-buttons">
                                        <button className="channel-edit-button" onClick={() => setShowChannelEdit(c.id)} disabled={servers[serverId].ownerId !== user.id} hidden={servers[serverId].ownerId !== user.id}><i class="fa-solid fa-gear"></i></button>
                                        <button className='channel-delete-button' onClick={deleteClick(c.id)} disabled={servers[serverId].ownerId !== user.id} hidden={servers[serverId].ownerId !== user.id}><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                </div>
                                <div className="update-channel-show" hidden={c.id!==showChannelEdit}>
                                    <ChannelForm formType={"Edit Channel"} channel={c} setShowChannelEdit={setShowChannelEdit} sessionLoaded={sessionLoaded} />
                                    <button className="close-server-form-button" onClick={() => setShowChannelEdit(-1)}>Cancel <i class="fa-solid fa-xmark"></i></button>
                                </div>
                            </div>
                        ))}
                </div>)}
                <div className="messages-whole-container">
                    <div className="channel-header">
                        {servers[serverId]?( <h3>

                                    Server {servers[serverId]?.name}
                                    {channelId!=='none'?`, Channel ${
                                        (servers[serverId] && servers[serverId].channelObj[channelId])?servers[serverId].channelObj[channelId].name:'Loading...'
                                        }`:`Has No Channels Now --- Try or Tell the Mod to Create a Channel!`}

                        </h3>):(<h3>"Loading..."</h3>)}
                    </div>
                    <div className="messages-container" >
                        {isLoaded && messages}
                        <div ref={messageContainer} />
                    </div>
                    <div className="message-form-container">
                        <form className="message-form">
                            <div className='message-form-label'>
                                <label
                                style={{color:(content.length >= 140)?'#f08486':''}}
                                >
                                Message:{content.length}/140
                                </label>
                                <textarea
                                    type="text"
                                    disabled={channelId === 'none'}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    required
                                    style={{border:(content.length >= 140)?'2px red solid':''}}
                                    minlength="1"
                                    maxlength="140"
                                    title="1 to 140 characters for the communication!"
                                />
                            </div>
                            <button onClick={submitMessage} disabled={channelId === 'none'}><i class="fa-solid fa-paper-plane"></i></button>
                        </form>
                    </div>
                </div>
            </div>)
}

export default MainPage;
