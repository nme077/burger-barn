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


const baseURL = process.env.NODE_ENV === 'production' ? 'https://burger-barn-1827.herokuapp.com' : 'http://localhost:9000';

function App() {
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminUser, setIsAdminUser] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    fetch(baseURL + '/logged_in', {
      method: "GET",
      credentials: 'include'
    })
    .then(async (res) => {
      const data = await res.json();
      if(data.error) return setError(data.error.message);
      setIsLoggedIn(data.userAuthenticated);
      data.userInfo && data.userInfo._id === '61e0b04b7eee8da38ef13f37' ? setIsAdminUser(true) : setIsAdminUser(false)
    }).catch(err => {
      return setError(err);
    })
  }, []);

  return (
    <Router>
        <Switch>
          <Route exact path="/createToken">
            {isAdminUser ? <GenerateToken /> : <div style={{color: "red"}}>Access Denied.</div>}
          </Route>
          <Route exact path="/admin">
            {!isLoggedIn ? 
              <Redirect to="/login" /> : 
              <DndProvider backend={HTML5Backend}>
                <Admin isAdminUser={isAdminUser} isLoggedIn={isLoggedIn} />
              </DndProvider>
            }
          </Route>
          <Route exact path="/register">
            {isLoggedIn ? <Redirect to="/admin" /> : <Register setIsLoggedIn={setIsLoggedIn} />}
          </Route>
          <Route exact path="/login">
            {isLoggedIn ? <Redirect to="/admin" /> : <Login setError={setError} error={error} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} setIsAdminUser={setIsAdminUser} />}
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