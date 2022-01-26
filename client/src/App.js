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


const baseURL = process.env.NODE_ENV === 'production' ? 'https://burger-barn-1827.herokuapp.com' : 'http://localhost:9000';

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is authenticated
  useEffect(() => {
    fetch(baseURL + '/logged_in', {
      method: "GET",
      credentials: 'include'
    })
    .then(async (res) => {
      const data = await res.json();
      setIsLoggedIn(data.userAuthenticated);
    }).catch(err => {
      console.log(err);
    })
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    fetch(baseURL + '/login', {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email, password })
    })
    .then(async (res) => {
        const data = await res.json();
        setIsSubmitting(false);
        data.success ? setIsLoggedIn(true) : setIsLoggedIn(false);
    }).catch(err => {
      setIsSubmitting(false);
      console.log(err);
    })
}

  return (
    <Router>
        <Switch>
          <Route path="/admin">
            {!isLoggedIn ? 
              <Redirect to="/login" /> : 
              <DndProvider backend={HTML5Backend}>
                <Admin />
              </DndProvider>
            }
          </Route>
          <Route path="/register">
            {isLoggedIn ? <Redirect to="/admin" /> : <Register />}
          </Route>
          <Route path="/login">
            {isLoggedIn ? <Redirect to="/admin" /> : 
            <div className="login-wrapper">
              <h1>Please Log In</h1>
              <form onSubmit={handleFormSubmit}>
              <label>
                  <p>Email</p>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
                </label>
                <label>
                  <p>Password</p>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
                </label>
                <div>
                  <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Log in'}</button>
                </div>
                {error ?
                  <div>
                      <p className="error-message">{error}</p>
                  </div>
                : null}
                <div></div>
              </form>
            </div>
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