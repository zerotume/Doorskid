import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, BrowserRouter as Router, useHistory, Switch, Route, useParams, useRouteMatch } from "react-router-dom";
import { getServersThunk } from "../../store/servers";




function MainPage(){

    const history = useHistory();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const servers = useSelector(state => state.servers);
    // const serverList = useSelector(state => state.servers.serverList);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if(!sessionUser) return history.push('/');
        dispatch(getServersThunk()).then(() => setIsLoaded(true))
    }, [dispatch, servers?.serverList?.length]);

    let {path, url} = useRouteMatch();
    // if(!sessionUser) return history.push('/');

    return (

        <Router>
            <div className="main-page-container">
                <div className="server-list">
                    {servers &&
                        servers.serverList &&
                        servers.serverList.length &&
                        servers.serverList.map(e => (
                            <Link className="server-item-link" to={`${url}/${e.id}/${e.Channels.length?e.Channels[0].id:"none"}`} >{e.name}</Link>
                            // <button className="server-item-button">{e.name}</button>
                        ))}
                </div>
            </div>

            <Switch>
                <Route exact path={path}></Route>
                <Route path={`${path}/:serverId/:channelId`}>
                    <ServerChannels servers={servers} path={path} url={url}/>
                </Route>
            </Switch>

        </Router>
    )

}

function ServerChannels({servers, path, url}){

    let {serverId, channelId} = useParams();
    let channels = [];
    if(channelId !== 'none') channels = servers[serverId].Channels;

    return (<div>
                {channels.length &&
                    channels.map(c => (
                        <Link className="channel-item-link" to={`${url}/${serverId}/${c.id}`} >{c.name}</Link>
                    ))
                }
                <h3>
                    Server {serverId} Channel {channelId}
                </h3>
            </div>)
}

export default MainPage;
