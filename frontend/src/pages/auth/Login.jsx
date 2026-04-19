import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.css";
import useUserDetails from "../../hooks/useUserDetails";

const Login = () => {
  const {setUserDetails} = useUserDetails()

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirectUser = (role) => {
    if (role === "STUDENT") {
      navigate("/dashboard");
    } else if (role === "ADVISOR") {
      navigate("/advisor-dashboard");
    } else if (role === "ADMIN") {
      navigate("/admin-dashboard");
    }
  };

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        throw new Error("Please fill all fields");
      }

      const res = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      setUserDetails(data)

      toast.success(data.message || "Login successful");


      localStorage.setItem("role", data.role ?? "");
      localStorage.setItem("name", data?.name ?? "");
      localStorage.setItem("picture", data.picture ?? "")
      localStorage.setItem("userId", data.userId ?? "");

      redirectUser(data.role);
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login to Smart Course System</h2>

        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>

        <p className="register-link">
         Don't have an account? <a href="/register">Register now</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
