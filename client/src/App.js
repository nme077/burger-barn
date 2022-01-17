import './App.css';
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Home from './components/Home';
import Admin from './components/Admin';
import Register from './components/Login/Register';
import Login from './components/Login/Login';

const baseURL = process.env.NODE_ENV === 'production' ? 'https://burger-barn-1827.herokuapp.com/' : 'http://localhost:9000/';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState();

  return (
    <Router>
        <Switch>
          <Route path="/admin">
            {isLoggedIn ? <Redirect to="/login" /> : <Admin />}
          </Route>
          <Route path="/register">
            {isLoggedIn ? <Redirect to="/admin" /> : <Register />}
          </Route>
          <Route path="/login">
            <Login />
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