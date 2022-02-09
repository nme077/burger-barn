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
import httpRequestUrl from './httpRequestUrl';
import RotateLoader from "react-spinners/RotateLoader";


function App() {
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isAdminUser, setIsAdminUser] = useState(null);

  const Loading = () => {
      return(
        <div className="loadingPage">
          <RotateLoader />
        </div>  
      )
  }

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
      data.userInfo && data.userInfo._id === '61fc95746205e701303f5e82' ? setIsAdminUser(true) : setIsAdminUser(false)
    }).catch(err => {
      return setError(err);
    })
  }, []);

  return (
    <Router>
        <Switch>
          <Route exact path="/createToken">
            {isLoggedIn === null ? 
              <Loading /> : 
              !isLoggedIn ? <Redirect to="/login" /> :
              isAdminUser ? <GenerateToken /> : <div style={{color: "red"}}>Access Denied. Only select users can add new users. Please contact the admin.</div>}
          </Route>
          <Route exact path="/admin">
            {isLoggedIn === null ? <Loading /> : 
              !isLoggedIn ? 
                <Redirect to="/login" /> : 
                <DndProvider backend={HTML5Backend}>
                  <Admin isAdminUser={isAdminUser} isLoggedIn={isLoggedIn} />
                </DndProvider>
            }
          </Route>
          <Route exact path="/register">
            {isLoggedIn === null ? <Loading /> : isLoggedIn ? <Redirect to="/admin" /> : <Register setIsLoggedIn={setIsLoggedIn} />}
          </Route>
          <Route exact path="/login">
            {isLoggedIn === null ? <Loading /> : isLoggedIn ? <Redirect to="/admin" /> : <Login setError={setError} error={error} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} setIsAdminUser={setIsAdminUser} />}
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