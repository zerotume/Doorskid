import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { getServersThunk } from "../../store/servers";
import * as sessionActions from "../../store/session";


function ProfileButton({user}){
    const dispatch = useDispatch();
    const history = useHistory();
    const [showMenu, setShowMenu] = useState(false)

    const openMenu = () => {
        if(showMenu) return;
        setShowMenu(true);
    }


    useEffect(() => {
        if(!showMenu) return;

        const closeMenu = () => {
            setShowMenu(false);
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    },[showMenu]);

    const logout = e => {
        e.preventDefault();
        dispatch(sessionActions.logoutAction());
    }

    const goback = e => {
        e.preventDefault()
        dispatch(getServersThunk());
        history.push('/main')
    }

    return (
        <div className="profile-bar">
            <button onClick={openMenu}>
                <i className="fas fa-user-circle"></i>
                <span className="profile-bar-text">  {user.firstName}  {user.lastName}</span>
            </button>
            {showMenu && (
                <ul className="profile-dropdown">
                    <li>{user.username}</li>
                    <li>{user.email}</li>
                    <li>
                        <button onClick={logout}>Log Out</button>
                        <button onClick={goback}>Close Channel!</button>
                    </li>
                </ul>
            )}
        </div>
    );
}

export default ProfileButton;
