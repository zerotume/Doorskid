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
                    <label
                        style={{color:(messageContent.length >= 140)?'#f08486':''}}
                    > Update message here: {messageContent.length}/140
                        </label>
                        <textarea
                        type="text"
                        placeholder="How you wanna change your message?"
                        minlength="1"
                        maxlength="140"
                        style={{border:(messageContent.length >= 140)?'2px red solid':''}}
                        title="1 to 140 characters for the communication!"
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
