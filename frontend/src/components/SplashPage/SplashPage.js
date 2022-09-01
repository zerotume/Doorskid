import { Link } from "react-router-dom";



function SplashPage(){
    return (
        <div className="splash-container">
            <div className="splash-header">
                <div className="splash-header-icon">Doorskid</div>
                <div className="splash-header-middle">  None  Of  These  Is  A  Live  Link  </div>
                <div className="splash-header-right">
                    <button className="splash-header-login splash-header-button">Login</button>
                </div>
            </div>
            <div className="splash-body">
                <div className="splash-content">
                    <div className="splash-title">IMAGINE A PLACE...</div>
                    <div className="splash-content">...where you can belong to a school club,
                        a gaming group, or a worldwide art community.<br />
                        Where just you and a handful of friends can spend time together.
                        A place that makes it easy<br /> to talk every day and hang out more often.
                    </div>
                    <div className="splash-buttons-container">
                        <button className="splash-register splash-button">I Wanna Join You</button>
                        <button className="splash-login splash-button">I've Already One Of You</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SplashPage;
