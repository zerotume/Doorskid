import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
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


    // if(!sessionUser) return history.push('/');

}


export default MainPage;
