import React, { useState } from 'react';

const baseURL = process.env.NODE_ENV === 'production' ? 'https://burger-barn-1827.herokuapp.com' : 'http://localhost:9000';

export default function Register() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        fetch(baseURL + '/register', {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password }),
        })
        .then(async (res) => {
            const data = await res.json();
            if(data.error) setError(data.error);
            setIsSubmitting(false);
        })
        .catch((res) => {
            alert(res);
            setIsSubmitting(false);
        })
    }

    return(
      <div className="login-wrapper">
        <h1>Create a new Admin Account</h1>
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
            <button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Registering...' : 'Register'}</button>
          </div>
          {error ?
             <div>
                 <p className="error-message">{error}</p>
            </div>
           : null}
        </form>
      </div>
    )
  }