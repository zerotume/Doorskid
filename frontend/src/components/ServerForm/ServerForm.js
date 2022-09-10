import { createServerThunk, editServerThunk, getServersThunk } from "../../store/servers";

const { useState, useEffect } = require("react");
const { useDispatch, useSelector } = require("react-redux");
const { useHistory } = require("react-router-dom");


function ServerForm({server, socket, formType, setShowServerEdit, setShowServerCreate, sessionLoaded, setRerender, showServerEdit, showServerCreate}){
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const [serverName, setServerName] = useState(server.name || '');
    const [errors, setErrors] = useState([]);
    const history = useHistory();

    const actions = {
        "Create Server":createServerThunk,
        "Edit Server":editServerThunk
    }

    useEffect(() => {
        setServerName(server.name || '');
    },[showServerEdit, showServerCreate]);

    const handleSubmit = async e => {
        e.preventDefault();
        server = {
            ...server,
            name:serverName,
        };
        setErrors([]);
        setServerName(server.name || "");
        let data = await dispatch(actions[formType](server));
        // console.log("wat?");
        if(data?.errors){
            // console.log("nani?")
            //todo: error handleing
        }else{
            // console.log("here!")
            if(formType==="Edit Server")setShowServerEdit(-1);
            if(formType==="Create Server")setShowServerCreate(false);
            // dispatch(getServersThunk());
            // socket.emit("somethingChanged", {serverId:server.id});
            dispatch(getServersThunk())
            setRerender({});
            setServerName("")
            return history.replace(`/main/${data.id}/${server.Channels?server.Channels[0].id:'none'}`);
        }
    }

    return sessionLoaded && (
        <div className="server-form-wrapper">
            <form className="doorskid-form server-form" onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <div className="server-form-label">
                    <label
                    style={{color:(serverName.length >= 8)?'#f08486':''}}
                    >
                        Server Name:{serverName.length}/8</label>
                        <input
                        type="text"
                        value={serverName}
                        style={{border:(serverName.length >= 8)?'2px red solid':''}}
                        onChange={(e) => setServerName(e.target.value)}
                        required
                        minlength="1"
                        maxlength="8"
                        pattern="[a-z0-9]{1,8}"
                        title="1 to 8 lower alpha and numbers"
                        placeholder="1 to 8 lower alpha and numbers"
                        />
                </div>
                <button className="server-form-input-button"
                    type="Submit"
                >{formType} <i class="fa-solid fa-check"></i></button>
            </form>
        </div>
    )
}

export default ServerForm;
