import React, { useState, useEffect } from 'react';
import RotateLoader from "react-spinners/RotateLoader";
import Sidebar from './Sidebar.js';

import httpRequestUrl from '../httpRequestUrl.js';

function Hours({isAdminUser}) {
    // State variables
    const [isLoading, setIsLoading] = useState(true);
    const [id, setId] = useState('');
    const [hours, setHours] = useState(null);
    const [charCount, setCharCount] = useState(null);
    // End state variables
  
    // Initialize the existing hours on page load
    useEffect(() => {
        fetch(httpRequestUrl + '/api/hours')
        .then((res) => res.json())
        .then((data) => {
            setHours(data.text)
            setCharCount(data.text.length)
            setId(data.id);
            setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        })
    },[]);

    // For initializing hours only
    //function handleAddItemSubmit(e) {
    //    e.preventDefault();
  //
    //    fetch(httpRequestUrl + '/api/hours/' + id, {
    //      method: 'POST',
    //      credentials: 'include',
    //      headers: {'Content-Type': 'application/json'},
    //      body: JSON.stringify({text: hours, id: id})
    //    }).then(() => {
    //        console.log('success');
    //    }).catch((err) => {
    //        console.log(err);
    //    })
    //  }
    
    function handleEditItemSubmit(e) {
      e.preventDefault();

      fetch(httpRequestUrl + '/api/hours/' + id, {
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text: hours, id: id})
      }).then(() => {
            setIsLoading(false);
      }).catch(() => {
            setIsLoading(false);
      })
    }

    function handleInput(e) {
        if(e.target.value.length <= 50) {
            setHours(e.target.value); 
            setCharCount(e.target.value.length);
        }
    }
  
    return (
      <div className="App">
        <div className="wrapper">
        <Sidebar isAdminUser={isAdminUser} active={'/admin/hours'}/>
  
          <div className="main">
              <div className="main-container">
                <div className="header-container">
                    <h2 className="admin-table-title">Hours/Announcements</h2>
                </div>

                {/* Edit Area */}  
                {isLoading? <div className="menuLoading"><RotateLoader /></div>: 
                <form className="add-item-inner-hours" onSubmit={handleEditItemSubmit}>
                    <input required className="add-item-input-hours" type="text" placeholder="Hours/Announcement" value={hours} onChange={handleInput} />
                    <div className="char-count">{charCount} / 50</div>
                    <button className="btn-edit-hours-submit" value="submit" style={{background: hours !== null && hours !== '' ? '#2F80ED' : 'rgba(164, 166, 179, 0.25)'}}><span>Save changes</span></button>
                </form>
                }
                {/* End Edit Area */}
              </div>
          </div>
        </div>
      </div>
    );
  }

  export default Hours