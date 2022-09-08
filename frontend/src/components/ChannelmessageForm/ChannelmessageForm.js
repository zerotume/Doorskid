import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";


function ChannelmessageForm({channelmessage, setShowChannelmessageEdit, sessionLoaded, socket, serverId, channelId}){
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const [messageContent, setMessageContent] = useState(channelmessage.content || '');
    const [errors, setErrors] = useState([]);
    const history = useHistory();

    const handleSubmit = async e => {
        e.preventDefault();
        channelmessage = {
            ...channelmessage,
            content:messageContent
        };
        // let data = await dispatch(actions[formType](channel));
        setErrors([]);
        // if(data.errors){
        //     //todo: error handling
        // }else{
        socket.emit("updateChannelmessage", {channelmessage, serverId, channelId})
        setShowChannelmessageEdit(-1);
        // if(formType === "Create Channel")setShowChannelCreate(false);
        setMessageContent('');
        // dispatch(getServersThunk()).then(() => history.replace(`/main`));
        // }
    }

    return sessionLoaded && (
        <div className="channelmessage-form-wrapper">
            <form className="doorskid-form channelmessage-form" onSubmit={handleSubmit}>
                <ul>
                    {errors.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <div className="channelmessage-form-label">
                    <label> Update message here:
                        </label>
                        <input
                        type="text"
                        placeholder="How you wanna change your message?"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        required
                        />
                </div>
                <button className="channelmessage-form-input-button"
                    type="Submit"
                 >Confirm Edit <i class="fa-solid fa-check"></i></button>
            </form>
        </div>
    )

}

export default ChannelmessageForm;
