
import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
    return (
        <nav className='bottom-nav-container'>
            <div className='bottom-links'>
                <div className='bottom-links-contributors'>
                    <p className='bottom-contributors-p'>Get In Touch</p>
                    <ul className='bottom-contributors-ul'>
                        <li>
                            <a href='https://github.com/zerotume' target="_blank" rel="noopener noreferrer">
                                Github
                            </a>
                        </li>
                        <li>
                            <a href='https://www.linkedin.com/in/heng-wang-547525234/' target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                        </li>
                        <li>
                            <a href='https://steamcommunity.com/id/zerotume/' target="_blank" rel="noopener noreferrer">
                                Steam
                            </a>
                        </li>
                    </ul>
                </div>
                <div className='bottom-links-wikis'>
                    <p className='bottom-wikis-p'>Project Github & Wiki</p>
                    <ul className='bottom-wikis-ul'>
                        <li>
                            <a href='https://github.com/zerotume/Doorskid' target="_blank" rel="noopener noreferrer">
                                Github Mainpage
                            </a>
                        </li>
                        <li>
                            <a href='https://github.com/zerotume/Doorskid/wiki/Database-Schema' target="_blank" rel="noopener noreferrer">
                                DB Schema
                            </a>
                        </li>
                        <li>
                            <a href='https://github.com/zerotume/Doorskid/wiki/Feature-List' target="_blank" rel="noopener noreferrer">
                                Feature List
                            </a>
                        </li>
                        <li>
                            <a href='https://github.com/zerotume/Doorskid/wiki/User-Stories' target="_blank" rel="noopener noreferrer">
                                User Stories
                            </a>
                        </li>
                    </ul>
                </div>
                <div className='bottom-links-tools'>
                    <p className='bottom-tools-p'>Tools Used</p>
                    <ul className='bottom-tools-ul'>
                        <li>
                            <a href='https://expressjs.com/' target="_blank" rel="noopener noreferrer">
                                Express
                            </a>
                        </li>
                        <li>
                            <a href='https://sequelize.org/' target="_blank" rel="noopener noreferrer">
                                Sequelize
                            </a>
                        </li>
                        <li>
                            <a href='https://socket.io/' target="_blank" rel="noopener noreferrer">
                                Socket.IO
                            </a>
                        </li>
                        <li>
                            <a href='https://www.sqlite.org/index.html' target="_blank" rel="noopener noreferrer">
                                SQLite
                            </a>
                        </li>
                        <li>
                            <a href='https://www.javascript.com/' target="_blank" rel="noopener noreferrer">
                                JavaScript
                            </a>
                        </li>
                        <li>
                            <a href='https://nodejs.org/en/' target="_blank" rel="noopener noreferrer">
                                Node.js®
                            </a>
                        </li>
                        <li>
                            <a href='https://reactjs.org/' target="_blank" rel="noopener noreferrer">
                                React
                            </a>
                        </li>
                        <li>
                            <a href='https://redux.js.org/' target="_blank" rel="noopener noreferrer">
                                Redux
                            </a>
                        </li>
                    </ul>
                </div>
                <div className='bottom-links-thank'>
                    <p className='bottom-thank-p'>Thanks to</p>
                    <ul className='bottom-thank-ul'>
                        <li>
                            <a href='https://www.heroku.com' target="_blank" rel="noopener noreferrer">
                                Heroku
                            </a>
                        </li>
                        <li>
                            <a href='https://www.postgresql.org/' target="_blank" rel="noopener noreferrer">
                                PostgreSQL
                            </a>
                        </li>
                        <li>
                            <a href='https://stackoverflow.com/' target="_blank" rel="noopener noreferrer">
                                Stack Overflow
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className='bottom-footer'>
                <div className='bottom-footer-left'>
                    <span className='bottom-footer-left-pre'>Instructed By </span>
                    <span className='bottom-footer-left-after'>a/A - App Academy</span>
                </div>
                <div className='bottom-footer-right'>
                    <span className='bottom-footer-right-info'>@ 2022 Doorskid</span>
                    <span className='bottom-footer-right-info'><a href='https://www.appacademy.io/' target="_blank" rel="noopener noreferrer">
                        Interested in a/A?
                    </a></span>
                    <span className='bottom-footer-right-info'><a href='https://www.appacademy.io/enterprise/hiring' target="_blank" rel="noopener noreferrer">
                        Hire a/A grads?
                    </a></span>
                </div>
            </div>

        </nav>
    );
}

export default BottomNav;
