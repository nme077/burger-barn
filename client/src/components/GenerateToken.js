import React, { useState } from 'react';

const baseURL = process.env.NODE_ENV === 'production' ? 'https://burger-barn-1827.herokuapp.com' : 'http://localhost:9000';

export default function GenerateToken() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [token, setToken] = useState('');
    const [tokenExpires, setTokenExpires] = useState('');
    const [tokenEmail, setTokenEmail] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        fetch(baseURL + '/createToken', {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email }),
        })
        .then(async (res) => {
            const data = await res.json();
            setIsSubmitting(false);
            if(data.error) return setError(data.error);
            setToken(data.token);
            setTokenExpires(data.tokenExpires);
            setTokenEmail(data.email);
        })
        .catch((err) => {
            setIsSubmitting(false);
            setError(err);
        })
    }

    return(
      <div className="auth-wrapper">
        <div className="auth-form">
          <h1>Generate token for new admin user</h1>
          <h5>Enter the email address for the user you would like to add as an admin. Note: This user will have permissions to edit the menu</h5>
          <form onSubmit={handleFormSubmit}>
              <input placeholder="Email" className="auth-form-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required/>
            <div>
              <button className="auth-form-btn" style={{background: email !== '' ? '#2F80ED' : 'rgba(164, 166, 179, 0.25)'}} type="submit" disabled={isSubmitting}>{isSubmitting ? 'Generating token...' : 'Generate token'}</button>
            </div>
            {error ?
              <div>
                  <p className="error-message">{error}</p>
              </div>
            : null}
            {token ? 
                <>
                    <h3>Provide the new user with the following information to create their account.</h3>
                    <p>Token for new user: {token}</p>
                    <p>Token expires {tokenExpires}</p>
                    <p>Valid for {tokenEmail}</p>
                </>
            : null}
          </form>
        </div>
      </div>
    )
  }