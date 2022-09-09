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
    const [errorString, setErrorString] = useState('');
    const [errorObj, setErrorObj] = useState({});

    if (sessionUser) return history.push("/main");

    const handleSubmit = e => {
        e.preventDefault();

        if(password !== confirmPassword){
            setErrors(["password is not equal to confirm password"]);
            return setErrorString("password is not equal to confirm password")
        }else{
            setErrors([]);
            setErrorString("");
            setErrorObj({});
            return dispatch(sessionActions.signupAction({email, username, firstName, lastName, password}))
                .catch(async (res) => {
                    const data = await res.json();
                    // console.log(data.errors);
                    if(data && data.errors){
                      if(Array.isArray(data.errors)){
                        setErrors(data.errors);
                        setErrorString(data.errors.join('/'))
                      }else{
                        setErrors(Object.values(data.errors));
                        setErrorObj(data.errors);
                      }

                    }
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
                  style={{border:(errorString.includes('email')||errorObj.email)?'2px red solid':''}}
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
                  pattern="[a-zA-Z0-9]{1,100}"
                  title="1 to 100 numbers or alphabates"
                  style={{border:(errorString.includes('username')||errorObj.username)?'2px red solid':''}}
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
                  pattern="[a-zA-Z0-9]{1,100}"
                  title="1 to 100 numbers or alphabates"
                  value={firstName}
                  style={{border:(errorString.includes('firstName')||errorObj.firstName)?'2px red solid':''}}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />

            </div>
            <div className='signup-form-label'>
              <label>
                Last Name</label>
                <input
                  type="text"
                  pattern="[a-zA-Z0-9]{1,100}"
                  title="1 to 100 numbers or alphabates"
                  value={lastName}
                  style={{border:(errorString.includes('lastName')||errorObj.lastName)?'2px red solid':''}}
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
                  style={{border:(errorString.includes('password')||errorObj.password)?'2px red solid':''}}
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
                  style={{border:(errorString.includes('password')||errorObj.password)?'2px red solid':''}}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />

            </div>
            <button className="signup-submit" type="submit">Sign Up</button>
            <div className="register-to-login lo-re-div">
              <Link className='register-to-login-link lore-link' to="/login">Already have an account?</Link>
              <p className='back-link'>
                <Link className='login-to-register-link lore-link' to="/">Back and consider again</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    );
}

export default SignupFormPage;
