import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { login } from "../helpers/auth/auth.helper.js";

const Login = () => {
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (auth?.user) {
      navigate("/home");
    }
  }, [auth]);

  const [userCreds, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser((prevUser) => ({
      ...prevUser,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(userCreds).finally(() => setLoading(false));
    const { message, user, token, status } = result;

    if (status === 200) {
      setAuth({
        ...auth,
        user,
        token,
      });
      toast(message, { type: "success" });
      navigate("/home");
      return;
    }

    toast(message, { type: "error" });
  };

  return (
    <div
      className="d-flex flex-lg-row flex-column bg-light text-dark"
      style={{ minHeight: "100vh" }}
    >
      {/* Left Side */}
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

      {/* Right Side */}
      <div
        className="col-lg-6 d-flex justify-content-center align-items-center"
        style={{
          padding: "3rem",
        }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <h1 className="display-5 mb-4 text-center">Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-4">
              <label htmlFor="email">Email</label>
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
            <div className="form-group mb-4">
              <label htmlFor="password">Password</label>
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
            <div className="d-grid gap-2">
              <button
                disabled={loading}
                type="submit"
                className="btn btn-primary"
              >
                {loading ? "Logging In..." : "Login"}
              </button>
            </div>
          </form>
          <hr className="my-4" />
          <p className="text-center mb-0">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
