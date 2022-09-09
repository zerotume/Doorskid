const { useState } = require("react");
const { useDispatch, useSelector } = require("react-redux");
const { useHistory } = require("react-router-dom");
const { editChannelThunk, createChannelThunk } = require("../../store/channels");
const { createServerThunk, getServersThunk } = require("../../store/servers");


function ChannelForm({channel, socket, formType, setShowChannelEdit, sessionLoaded, setShowChannelCreate, setRerender}){
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const [channelName, setChannelName] = useState(channel.name || '')
    const [errors, setErrors] = useState([]);
    const history = useHistory();

    const actions = {
        "Create Channel":createChannelThunk,
        "Edit Channel":editChannelThunk
    }

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
            setRerender({});
            setChannelName('');
            return history.replace(`/main/${channel.serverId}/${data.id}`)
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
                        style={{color:(channelName.length >= 20)?'#f08486':''}}
                    >
                        Channel Name:{channelName.length}/20</label>
                        <input
                        type="text"
                        pattern="[a-zA-Z0-9]{1,20}"
                        placeholder="1 to 20 alpha and numbers"
                        value={channelName}
                        style={{border:(channelName.length >= 20)?'2px red solid':''}}
                        minlength="1"
                        maxlength="20"
                        onChange={(e) => setChannelName(e.target.value)}
                        required
                        title="1 to 20 alpha and numbers"
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
