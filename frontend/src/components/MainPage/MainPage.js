import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, BrowserRouter as Router, useHistory, Switch, Route, useParams, useRouteMatch } from "react-router-dom";
import { getServersThunk } from "../../store/servers";
import io from "socket.io-client";
import { getChannelmessagesThunk } from "../../store/channelmessages";
const SOCKET_IO_URL = "ws://localhost:3000";
const socket = io(SOCKET_IO_URL);




function MainPage({sessionLoaded}){

    const history = useHistory();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const servers = useSelector(state => state.servers);
    // const serverList = useSelector(state => state.servers.serverList);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getServersThunk()).then(() => setIsLoaded(true))
        // if(!isLoaded && !sessionUser) return history.push('/');
    }, [dispatch, servers?.serverList?.length]);


    let {path, url} = useRouteMatch();
    if(sessionLoaded && !sessionUser) return history.push('/');
    // if(!sessionUser) return history.push('/');

    return isLoaded && sessionUser && (

        <Router>
            <div className="main-page-container">
                <div className="server-list">
                    {servers &&
                        servers.serverList &&
                        servers.serverList.length &&
                        servers.serverList.map(e => (
                            <Link className="server-item-link"
                                to={`${url}/${e.id}/${e.Channels.length?e.Channels[0].id:"none"}`} > {e.name} |</Link>
                            // <button className="server-item-button">{e.name}</button>
                        ))}
                </div>
            </div>

            <Switch>
                <Route exact path={path}>
                    <h3>Click a server to see messages!</h3>
                </Route>
                <Route path={`${path}/:serverId/:channelId`}>
                    <ServerChannels servers={servers} path={path} url={url} user={sessionUser}/>
                </Route>
            </Switch>

        </Router>
    )
}
function ServerChannels({servers, path, url, user}){

    const dispatch = useDispatch();
    let {serverId, channelId} = useParams();
    let userId = user.id;
    let channels = [];
    const [isLoaded, setIsLoaded] = useState(false);
    const channelmessages = useSelector(state => state.channelmessages);
    if(channelId !== 'none') channels = servers[serverId].Channels;

    useEffect(() => {
        dispatch(getChannelmessagesThunk(channelId)).then(() => setIsLoaded(true))
        // if(!isLoaded && !sessionUser) return history.push('/');
        console.log(channelmessages)

    }, [dispatch, channelId]);

    // const connectToChannel = () => {

    // }

    socket.emit("join", userId);

    const submitMessage = e => {
        e.preventDefault();
        const d = new Date();
        const data = {serverId, channelId, content:"test", userId, sendTime:d.getTime()};
        socket.emit("channelMessage", data);
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
                        <Link className="channel-item-link"
                            to={`${url}/${serverId}/${c.id}`} > {c.name} |</Link>
                    ))
                }
                <h3>
                    Server {serverId} Channel {channelId}
                </h3>


                <div className="messages-container">
                    {isLoaded && messages}
                </div>
                <button onClick={submitMessage}>test</button>
            </div>)
}

export default MainPage;
