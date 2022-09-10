const { useState, useEffect } = require("react");
const { useDispatch, useSelector } = require("react-redux");
const { useHistory } = require("react-router-dom");
const { editChannelThunk, createChannelThunk } = require("../../store/channels");
const { createServerThunk, getServersThunk } = require("../../store/servers");


function ChannelForm({channel, socket, formType, setShowChannelEdit, sessionLoaded, setShowChannelCreate, setRerender, showChannelEdit, showChannelCreate}){
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const [channelName, setChannelName] = useState(channel.name || '')
    const [errors, setErrors] = useState([]);
    const history = useHistory();

    const actions = {
        "Create Channel":createChannelThunk,
        "Edit Channel":editChannelThunk
    }

    useEffect(() => {
        setChannelName(channel.name || '')
    },[showChannelEdit, showChannelCreate]);

    const handleSubmit = async e => {
        e.preventDefault();
        channel = {
            ...channel,
            name:channelName
        };

        let data = await dispatch(actions[formType](channel));
        setErrors([]);

        if(data?.errors){
            //todo: error handling
        }else{
            if(formType === "Edit Channel")setShowChannelEdit(-1);
            if(formType === "Create Channel")setShowChannelCreate(false);
            // socket.emit("somethingChanged", {serverId:channel.serverId});
            dispatch(getServersThunk());
            setChannelName('');
            history.replace(`/main/${channel.serverId}/${data.id}`)
            return setRerender({});
        }
    }

    return sessionLoaded && (
        <div className="channel-form-wrapper">
            <form className="doorskid-form channel-form" onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <div className="channel-form-label">
                    <label
                        style={{color:(channelName.length >= 15)?'#f08486':''}}
                    >
                        Channel Name:{channelName.length}/15</label>
                        <input
                        type="text"
                        pattern="[a-z0-9]{1,15}"
                        title="1 to 15 lower alpha and numbers"
                        placeholder="1 to 15 lower alpha and numbers"
                        value={channelName}
                        style={{border:(channelName.length >= 15)?'2px red solid':''}}
                        minlength="1"
                        maxlength="15"
                        onChange={(e) => setChannelName(e.target.value)}
                        required
                        />
                </div>
                <button className="channel-form-input-button"
                    type="Submit"
                >{formType} <i class="fa-solid fa-check"></i></button>
            </form>
        </div>
    )
}


export default ChannelForm;
