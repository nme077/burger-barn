import React, { useState } from 'react';
import httpRequestUrl from '../../httpRequestUrl';

export default function Login({setError, error, setIsLoggedIn, setIsAdminUser}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
    
        fetch(httpRequestUrl + '/login', {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password })
        })
        .then(async (res) => {
            const data = await res.json();
            setIsSubmitting(false);
            if(data.error) setError(data.error.message)//return setError(data.error);
            data.success ? setIsLoggedIn(true) : setIsLoggedIn(false);
            data.userInfo && data.userInfo._id === '61fc95746205e701303f5e82' ? setIsAdminUser(true) : setIsAdminUser(false)
        }).catch(err => {
          setIsSubmitting(false);
          if(err) return setError(err);
        })
      }

    return(
    <div className="auth-wrapper">
        <div className="auth-form">
        <h1>Log in to Burger Barn</h1>
        <form onSubmit={handleFormSubmit}>
            <input placeholder="Email" className="auth-form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
            <input placeholder="Password" className="auth-form-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
            <div>
            <button className="auth-form-btn" style={{background: email !== '' && password !== '' ? '#2F80ED' : 'rgba(164, 166, 179, 0.25)'}} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Log in'}</button>
            </div>
            {error ?
            <div>
                <p className="error-message">{error}</p>
            </div>
            : null}
            <div></div>
        </form>
        </div>
    </div>
    )
}