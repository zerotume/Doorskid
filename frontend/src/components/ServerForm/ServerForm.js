import { createServerThunk, editServerThunk } from "../../store/servers";

const { useState } = require("react");
const { useDispatch, useSelector } = require("react-redux");
const { useHistory } = require("react-router-dom");


function ServerForm({server, formType, setShowServerEdit, sessionLoaded}){
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

        let data = await dispatch(actions[formType](server));
        if(data){
            //todo: error handleing
        }else{
            if(formType==="Edit Server")setShowServerEdit(-1);
            history.push(`/main/${server.id}/none`);
        }

    }

    return sessionLoaded && (
        <div className="server-form-wrapper">
            <form className="doorskid-form server-form" onClick={handleSubmit}>
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
                <input className="server-form-input-button"
                    type="Submit"
                value={formType} />
            </form>
        </div>
    )

}

export default ServerForm;
