import React, { useState } from 'react';

const AuthPage: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const showState = () => {
    console.log(form);
  };

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <h1>URL Shortener</h1>
        <div className="card blue darken-4">
          <div className="card-content white-text">
            <span className="card-title">Authorization</span>
            <div>
              <div className="input-field">
                <input
                  placeholder="Enter Email"
                  id="email"
                  type="text"
                  name="email"
                  className="yellow-input"
                  onChange={changeHandler}
                />
              </div>
              <div className="input-field">
                <input
                  placeholder="Enter Password"
                  id="password"
                  type="password"
                  name="password"
                  className="yellow-input"
                  onChange={changeHandler}
                />
              </div>
            </div>
          </div>
          <div className="card-action">
            <button className="btn yellow darken-4" style={{ marginRight: 10 }}>
              Sign in
            </button>
            <button onClick={showState} className="btn grey lighten-1 black-text">
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
