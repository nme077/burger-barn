import React from 'react';
import { useHistory } from "react-router-dom";

import httpRequestUrl from '../httpRequestUrl.js';

function Sidebar({active}) {
    const history = useHistory();
    //Logout
    function logout(e) {
      fetch(httpRequestUrl + '/logout', {
        method: 'POST',
        credentials: 'include',
        headers: { "Content-Type": "application/json" }
      }).then((res) => {
        history.push('/');
      }).catch((err) => {
        console.log(err);
      })
    }

    return (
        <div id="sidebar">
              <div className="sidebar-heading">
                  <i className="fas fa-hamburger sidebar-heading-icon"></i>
                  <h3 className="sidebar-heading-title">Admin</h3>
              </div>
              <div className="sidebar-selection-container">
                  <a className={`sidebar-selection ${active==='/admin' ? 'active' : null}`} href="/admin">
                      <i className="fas fa-utensils sidebar-selection-icon"></i> Menu
                  </a>
              </div>
              <div className="sidebar-selection-container">
                  <a className={`sidebar-selection ${active==='/createToken' ? 'active' : null}`} href="/createToken">
                      <i className="fas fa-key sidebar-selection-icon"></i> Invite New User
                  </a>
              </div>
              <div className="sidebar-selection-container">
                  <a className={`sidebar-selection ${active==='/admin/hours' ? 'active' : null}`} href="/admin/hours">
                      <i className="fas fa-clock sidebar-selection-icon"></i> Hours
                  </a>
              </div>
              <div className="sidebar-selection-container">
                  <a className="sidebar-selection" href="/">
                      <i className="fas fa-home sidebar-selection-icon"></i> Home
                  </a>
              </div>
              <div className="sidebar-selection-container logout">
                  <button className="sidebar-selection" onClick={logout}>
                      <i className="fas fa-sign-out-alt sidebar-selection-icon"></i> Logout
                  </button>
              </div>
        </div>  
    );
  }

  export default Sidebar