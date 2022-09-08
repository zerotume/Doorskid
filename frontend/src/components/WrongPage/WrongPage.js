import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import "./WrongPage.css";

function WrongPage(){

    const history = useHistory();
    const [timer,setTimer] = useState(5);


    useEffect(() => {
        setTimeout(() => {
            history.replace("/main");
        }, 3000);
    },[])

// useEffect(() => {

// })

    return (
        <div className="wrong-container">
            <div className="wrong-notice-container">
                <h1>Looks like you've visited the forbidden area.</h1>
                <h2>But no worries, We'll send you back in 3 seconds!</h2>
                <h2>Or you want to go back faster: <Link to="/main">Express Way</Link></h2>
            </div>
        </div>
    )
}

export default WrongPage;
