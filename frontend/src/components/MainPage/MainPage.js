import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";




function MainPage(){

    const history = useHistory();
    const sessionUser = useSelector(state => state.session.user);

    if(!sessionUser) return history.push('/');


}


export default MainPage;
