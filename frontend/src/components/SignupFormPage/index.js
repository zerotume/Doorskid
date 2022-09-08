import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {Link, Redirect, useHistory} from "react-router-dom";
import * as sessionActions from "../../store/session";
import "./SignupFormPage.css"


function SignupFormPage() {

    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const history = useHistory();
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState([]);

    if (sessionUser) return history.push("/main");

    const handleSubmit = e => {
        e.preventDefault();

        if(password !== confirmPassword){
            return setErrors(["password is not equal to confirm password"]);
        }else{
            setErrors([]);
            return dispatch(sessionActions.signupAction({email, username, firstName, lastName, password}))
                .catch(async (res) => {
                    const data = await res.json();
                    if(data && data.errors) setErrors(data.errors);
                });
        }
    }

    return(
      <div className='signup-page'>
        <div className="signup-container">
          <div className="signup-title">Create an account</div>
          <form onSubmit={handleSubmit} className="signup-form">
            <ul>
              {errors.map((error, idx) => <li key={idx}>{error}</li>)}
            </ul>
            <div className='signup-form-label'>
              <label>
                Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

            </div>
            <div className='signup-form-label'>
              <label>
                Username </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />

            </div>
            <div className='signup-form-label'>
              <label>
                First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />

            </div>
            <div className='signup-form-label'>
              <label>
                Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />

            </div>
            <div className='signup-form-label'>
              <label>
                Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

            </div>
            <div className='signup-form-label'>
              <label>
                Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

            </div>
            <button type="submit">Sign Up</button>
            <div className="register-to-login lo-re-div">
              <Link className='register-to-login-link lore-link' to="/login">Already have an account?</Link>
            </div>
          </form>
        </div>
      </div>
    );
}

export default SignupFormPage;
