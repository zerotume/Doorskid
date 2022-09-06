const { useState } = require("react");
const { useDispatch, useSelector } = require("react-redux");


function ChannelForm({channel, formType, setShowChannelEdit, sessionLoaded}){
    const dispatch = useDispatch();
    const user = useSelector(state => state.session.user);
    const [channelName, setChannelName] = useState(channel.name || '')
}
