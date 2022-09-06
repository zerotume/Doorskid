import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, BrowserRouter as Router, useHistory, Switch, Route, useParams, useRouteMatch } from "react-router-dom";
import { getServersThunk } from "../../store/servers";
import io from "socket.io-client";
import { getChannelmessagesThunk } from "../../store/channelmessages";
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
    }, [dispatch, servers?.serverList?.length, sessionUser]);



    if(sessionLoaded && !sessionUser) return history.push('/');
    // if(!sessionUser) return history.push('/');
    // let newMessage = {};
    return isLoaded && sessionUser && (

        <Router>
            <div className="main-page-container">
                <div className="server-list">
                    {servers &&
                        servers.serverList &&
                        servers.serverList.length &&
                        servers.serverList.map(e => (
                            <>
                                <span className="server-item-unread" hidden={!newServerMessage[e.id] || serverId===e.id.toString()}>*</span>
                                <Link className="server-item-link" onClick={() => setNewServerMessage({...newServerMessage, [serverId]:false})}
                                    to={`${url}/${e.id}/${e.Channels.length?e.Channels[0].id:"none"}`} > {e.name} |</Link>
                                {/* // <button className="server-item-button">{e.name}</button> */}
                            </>
                        ))}
                </div>
            </div>

            <Switch>
                <Route exact path={path}>
                    <h3>Click a server to see messages!</h3>
                </Route>
                <Route path={`${path}/:serverId/:channelId`}>
                    <ServerChannels servers={servers} path={path} url={url} user={sessionUser}
                    newServerMessage={newServerMessage} newChannelMessage={newChannelMessage}
                    setNewServerMessage={setNewServerMessage} setNewChannelMessage={setNewChannelMessage}
                    />
                </Route>
            </Switch>

        </Router>
    )
}
function ServerChannels({servers, path, url, user, newServerMessage, newChannelMessage, setNewServerMessage, setNewChannelMessage}){

    // console.log(newChannelMessage);
    const dispatch = useDispatch();
    let {serverId, channelId} = useParams();
    let userId = user.id;
    let channels = [];
    const [isLoaded, setIsLoaded] = useState(false);
    const [content, setContent] = useState('');
    const channelmessages = useSelector(state => state.channelmessages);
    if(channelId !== 'none') channels = servers[serverId].Channels;

    // setNewServerMessage({...newServerMessage, [serverId]:false});
    // if(channelId !== 'none')setNewChannelMessage({...newChannelMessage, [channelId]:false});

    useEffect(() => {
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

    }, [dispatch, channelId]);

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

    let messages = null;
    if(channelmessages && channelmessages.channelmessageList && channelmessages.channelmessageList.length){
        messages = (channelmessages.channelmessageList.map(e => (
            <div className="single-message-container">
                <div className="message-sender-container">{e.User.firstName} {e.User.lastName}</div>
                <div className="message-content-container">{e.content}</div>
            </div>
        )))
    }else{
        messages = null;
    }

    return (<div>
                {channels.length &&
                    channels.map(c => (
                        <>
                            <span className="channel-item-unread" hidden={!newChannelMessage[c.id] || c.id.toString() === channelId}>*</span>
                            <Link className="channel-item-link" onClick={() => setNewChannelMessage({...newChannelMessage, [channelId]:false})}
                                to={`${url}/${serverId}/${c.id}`} > {c.name} |</Link>
                        </>
                    ))
                }
                <h3>
                    Server {serverId} Channel {channelId}
                </h3>


                <div className="messages-container">
                    {isLoaded && messages}
                </div>
                <form className="message-form">
                    <div className='message-form-label'>
                        <label>
                        Message:
                        <input
                            type="text"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                        </label>
                    </div>
                    <button onClick={submitMessage}>submit</button>
                </form>
            </div>)
}

export default MainPage;
