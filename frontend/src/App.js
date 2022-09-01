import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router";
import LoginFormPage from "./components/LoginFormPage";
import MainPage from "./components/MainPage/MainPage";
import Navigation from "./components/Navigation";
import SignupFormPage from "./components/SignupFormPage";
import SplashPage from "./components/SplashPage/SplashPage";
import * as sessionActions from './store/session';

function App() {
  const dispatch = useDispatch();
  const [sessionLoaded, setSessionLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreSession())
                .then(() => setSessionLoaded(true));
  },[dispatch])


  return (
    <div>
      {/* <h1>Hello from App</h1> */}
      {/* <Navigation sessionLoaded={sessionLoaded}/> */}
      <Switch>
        <Route path="/" exact>
          <SplashPage />
        </Route>
        <Route path="/login">
          <LoginFormPage />
        </Route>
        <Route path="/signup">
          <SignupFormPage />
        </Route>
        <Route path="/main">
          <MainPage sessionLoaded={sessionLoaded}/>
        </Route>
      </Switch>
    </div>
  );
}

export default App;
