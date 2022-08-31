import React, { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Redirect, useHistory } from 'react-router-dom';

function LoginFormPage() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const history = useHistory();
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  if (sessionUser) return history.push("/main");

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    const user = {credential, password}
    return dispatch(sessionActions.loginAction(user))
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors);
      });
  }

  return (

    <div className='login-page'>
      <div className='login-container'>
        <div className='login-title'>Welcome back!</div>
        <div className='login-subtitle'>We're so excited to see you again!</div>
        <form className='login-form' onSubmit={handleSubmit}>
          <ul>
            {errors.map((error, idx) => <li key={idx}>{error}</li>)}
          </ul>
          <div className='login-form-label login-credential'>
            <label>
              Credential: (Username or Email)
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </label>
          </div>
          <div className='login-form-label login-password'>
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
          </div>
          <button className='login-submit' type="submit">Log In</button>
        </form>
      </div>
      <div className='login-to-register lo-re-div'>
        <span className='login-to-register-text lore-text'>Need an account?</span>
        <Link className='login-to-register-link lore-link' to="/signup">Register</Link>
      </div>
    </div>
  );
}

export default LoginFormPage;
