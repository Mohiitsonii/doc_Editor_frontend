import React, { useState, useEffect } from 'react';
import { register } from '../helpers/auth/auth.helper.js';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [userCreds, setUser] = useState({
    username: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    if (localStorage.getItem('auth')) {
      navigate('/home');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (userCreds.username.length < 3) {
      toast.warning('Username must be at least 3 characters long');
      return;
    } else if (userCreds.password.length < 6) {
      toast.warning('Password must be at least 6 characters long');
      return;
    } else if (userCreds.username.length > 10) {
      toast.warning('Username must be less than 10 characters long');
      return;
    }

    // Perform registration
    const result = await register(userCreds);
    if (result.status === 201) {
      toast.success(result.message);
      navigate('/');
    } else if (result.status === 400) {
      toast.warning(result.message);
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div
    className="d-flex flex-lg-row flex-column bg-light text-dark"
    style={{ minHeight: "100vh" }}
  >      <div className="row w-100">
        {/* Left Blue Side */}
        <div
        className="col-lg-6 d-flex flex-column justify-content-center align-items-center"
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "4rem",
        }}
      >
               <h1 className="display-4 fw-bold mb-3">Welcome to DocEditor!</h1>
        <p className="lead text-center">
          Access your account to manage your data and stay updated with our
          services.
        </p>
      </div>


        {/* Right Light Side (Form Section) */}
        <div className="col-md-6 p-5 bg-light shadow rounded">
          <h1 className="display-4 mb-4 text-center text-dark">Register</h1>
          <form onSubmit={handleSubmit} className="w-100">
            <div className="form-group mb-3">
              <label htmlFor="username" className="text-dark">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={userCreds.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="email" className="text-dark">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={userCreds.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" className="text-dark">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={userCreds.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="d-grid gap-2 my-3">
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>
          <hr className="my-4 border-dark" />
          <p className="text-center text-dark">
            Already have an account?{' '}
            <Link to="/" className="text-primary">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
