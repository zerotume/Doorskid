import { createServerThunk, editServerThunk, getServersThunk } from "../../store/servers";

const { useState } = require("react");
const { useDispatch, useSelector } = require("react-redux");
const { useHistory } = require("react-router-dom");


function ServerForm({server, formType, setShowServerEdit, setShowServerCreate, sessionLoaded}){
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
        setServerName("");
        let data = await dispatch(actions[formType](server));
        // console.log("wat?");
        if(data.errors){
            // console.log("nani?")
            //todo: error handleing
        }else{
            // console.log("here!")
            if(formType==="Edit Server")setShowServerEdit(-1);
            if(formType==="Create Server")setShowServerCreate(false);
            dispatch(getServersThunk());
            dispatch(getServersThunk()).then(() => history.replace(`/main`));
        }
    }

    return sessionLoaded && (
        <div className="server-form-wrapper">
            <form className="doorskid-form server-form" onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <div className="server-form-label">
                    <label>
                        Server Name:</label>
                        <input
                        type="text"
                        placeholder="input your server name here!"
                        value={serverName}
                        onChange={(e) => setServerName(e.target.value)}
                        required
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
