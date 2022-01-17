import React, { useState } from 'react';

const baseURL = process.env.NODE_ENV === 'production' ? 'https://burger-barn-1827.herokuapp.com' : 'http://localhost:9000';

export default function Login() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState();

    

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        fetch(baseURL + '/login', {
            method: "POST",
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password }),
        })
        .then(async (res) => {
            const data = await res.json();
            setIsSubmitting(false);

            if(data.error) return setError(data.error);
            return console.log(data)
        })
        .catch(async(err) => {
            setIsSubmitting(false);
            const errorMessage = await err;
            console.error('Error:', errorMessage);
        })
    }

    return(
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
        </form>
      </div>
    )
  }