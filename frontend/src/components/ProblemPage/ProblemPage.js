import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { getServersThunk } from "../../store/servers";
import "./ProblemPage.css";

function ProblemPage(){

    const history = useHistory();
    const [timer,setTimer] = useState(5);
    const dispatch = useDispatch();


    useEffect(() => {

        dispatch(getServersThunk());
        setTimeout(() => {
            history.replace("/main");
        }, 3000);
    },[])

// useEffect(() => {

// })

    return (
        <div className="problem-container">
            <div className="problem-notice-container">
                <h1>Looks like --- <br />
                    <span className="problem-red">
                         your previous position is nuked.
                    </span>
                </h1>
                <h2 className="problem-red">The mod just deleted/modified the server/channel.</h2>
                <h2>But no worries, We'll send you back in 3 seconds!</h2>
                <h2>Or you want to go back faster: <Link to="/main">Express Way</Link></h2>
            </div>
        </div>
    )
}

export default ProblemPage;
