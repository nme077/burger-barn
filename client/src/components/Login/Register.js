import React, { useState } from 'react';
import httpRequestUrl from '../../httpRequestUrl';

export default function Register({setIsLoggedIn}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        fetch(httpRequestUrl + '/register', {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password, token }),
        })
        .then(async (res) => {
            const data = await res.json();
            setIsSubmitting(false);
            if(data.error) return setError(data.error);
            setIsLoggedIn(true);
        })
        .catch((err) => {
            setIsSubmitting(false);
            setError(err);
        })
    }

    return(
      <div className="auth-wrapper">
        <div className="auth-form">
          <h1>Create a new Admin Account</h1>
          <h3>You must obtain a token from an existing user to register.</h3>
          <form onSubmit={handleFormSubmit}>
              <input placeholder="Token" className="auth-form-input" type="text" value={token} onChange={e => setToken(e.target.value)} required/>
              <input placeholder="Email" className="auth-form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
              <input placeholder="Create a password" className="auth-form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
            <div>
              <button className="auth-form-btn" style={{background: email !== '' && password !== '' ? '#2F80ED' : 'rgba(164, 166, 179, 0.25)'}} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Register'}</button>
            </div>
            {error ?
              <div>
                  <p className="error-message">{error}</p>
              </div>
            : null}
            <div className="auth-nav-link">
              <a href="/login">Already have an account? Login.</a>
            </div>
          </form>
        </div>
      </div>
    )
  }