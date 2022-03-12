import React, { useState } from 'react';
import {
    useParams
  } from "react-router-dom";
import httpRequestUrl from '../../httpRequestUrl';

export default function Login({setError, error, setSuccess, success}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    let {token} = useParams();

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        fetch(httpRequestUrl + '/reset/' + token, {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password, confirmPassword })
        })
        .then(async (res) => {
            const data = await res.json();
            setIsSubmitting(false);
            if(data.error) return setError(data.error);
            return setSuccess(data.success)
        }).catch(err => {
          setIsSubmitting(false);
          if(err) return setError(err);
        })
      }

    return(
    <div className="auth-wrapper">
        <div className="auth-form">
        <h1>Reset Password</h1>
        <form onSubmit={handleFormSubmit}>
            <input placeholder="New Password" className="auth-form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
            <input placeholder="Confirm Password" className="auth-form-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required/>
            <div>
                <button className="auth-form-btn" style={{background: password !== '' && confirmPassword !== '' ? '#2F80ED' : 'rgba(164, 166, 179, 0.25)'}} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Resetting...' : 'Reset Password'}</button>
            </div>
            <div className="auth-nav-link">
              <a href="/login">Remember your password? Login.</a>
            </div>
            {error || success ?
            <div>
                <p className="error-message">{error}</p>
                <p className="success-message">{success}</p>
            </div>
            : null}
        </form>
        </div>
    </div>
    )
}