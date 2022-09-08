import { createServerThunk, editServerThunk, getServersThunk } from "../../store/servers";

const { useState } = require("react");
const { useDispatch, useSelector } = require("react-redux");
const { useHistory } = require("react-router-dom");


function ServerForm({server, socket, formType, setShowServerEdit, setShowServerCreate, sessionLoaded, setRerender}){
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const [serverName, setServerName] = useState(server.name || '');
    const [errors, setErrors] = useState([]);
    const history = useHistory();

    const actions = {
        "Create Server":createServerThunk,
        "Edit Server":editServerThunk
    }

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
            dispatch(getServersThunk()).then(() => {
                setRerender({});
                console.log('here')
                return history.replace(`/main`)
            });
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
                    style={{color:(serverName.length >= 10)?'#f08486':''}}
                    >
                        Server Name:{serverName.length}/10</label>
                        <input
                        type="text"
                        placeholder="1 to 10 alpha and numbers"
                        value={serverName}
                        style={{border:(serverName.length >= 10)?'2px red solid':''}}
                        onChange={(e) => setServerName(e.target.value)}
                        required
                        minlength="1"
                        maxlength="10"
                        pattern="[a-zA-Z0-9]{1,10}"
                        title="1 to 10 alpha and numbers"
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
