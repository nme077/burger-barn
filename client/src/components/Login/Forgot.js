import React, { useState } from 'react';
import httpRequestUrl from '../../httpRequestUrl';

export default function Login({setError, error, setSuccess, success}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
    
        fetch(httpRequestUrl + '/forgot', {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email })
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
        <h1>Forgot Password?</h1>
        <h4>Enter your email below and we will send you an email with instructions to reset your password.</h4>
        <form onSubmit={handleFormSubmit}>
            <input placeholder="Email" className="auth-form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
            <div>
                <button className="auth-form-btn" style={{background: email !== '' ? '#2F80ED' : 'rgba(164, 166, 179, 0.25)'}} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Send reset link'}</button>
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