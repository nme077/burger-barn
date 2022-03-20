import './App.css';
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Home from './components/Home';
import Admin from './components/Admin';
import Register from './components/Login/Register';
import Login from './components/Login/Login';
import GenerateToken from './components/GenerateToken';
import Loading from './components/Loading';
import Hours from './components/Hours';
import Forgot from './components/Login/Forgot';
import Reset from './components/Login/Reset';
import httpRequestUrl from './httpRequestUrl';


function App() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  // Check if user is authenticated
  useEffect(() => {
    fetch(httpRequestUrl+ '/logged_in', {
      method: "GET",
      credentials: 'include'
    })
    .then(async (res) => {
      const data = await res.json();
      if(data.error) return setError(data.error.message);
      setIsLoggedIn(data.userAuthenticated);
    }).catch(err => {
      return setError(err);
    })
  }, []);

  return (
    <Router>
        <Switch>
          <Route exact path="/createToken">
            {isLoggedIn === null ? <Loading /> : 
              !isLoggedIn ? <Redirect to="/login" /> :
              <GenerateToken />}
          </Route>
          <Route exact path="/admin/hours">
            {isLoggedIn === null ? <Loading /> : 
              !isLoggedIn ? <Redirect to="/login" /> : 
                <DndProvider backend={HTML5Backend}>
                  <Hours isLoggedIn={isLoggedIn} />
                </DndProvider>
            }
          </Route>
          <Route exact path="/admin">
            {isLoggedIn === null ? <Loading /> : 
              !isLoggedIn ? <Redirect to="/login" /> : 
                <DndProvider backend={HTML5Backend}>
                  <Admin isLoggedIn={isLoggedIn} />
                </DndProvider>
            }
          </Route>
          <Route exact path="/register">
            {isLoggedIn === null ? <Loading /> : isLoggedIn ? <Redirect to="/admin" /> : <Register setIsLoggedIn={setIsLoggedIn} />}
          </Route>
          <Route exact path="/forgot">
            {isLoggedIn === null ? <Loading /> : isLoggedIn ? <Redirect to="/admin" /> : <Forgot setError={setError} error={error} setSuccess={setSuccess} success={success} />}
          </Route>
          <Route exact path="/reset/:token">
            {isLoggedIn === null ? <Loading /> : isLoggedIn ? <Redirect to="/admin" /> : <Reset setError={setError} error={error} setSuccess={setSuccess} success={success} />}
          </Route>
          <Route exact path="/login">
            {isLoggedIn === null ? <Loading /> : 
              isLoggedIn ? <Redirect to="/admin" /> : 
              <Login setError={setError} error={error} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
            }
          </Route>
          <Route exact path="/">
            <Home menu />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
    </Router>
  );

}

export default App;