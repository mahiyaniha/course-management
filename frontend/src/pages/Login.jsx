import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const redirectUser = (role) => {
    if (role === "student") {
      navigate("/dashboard");
    } else if (role === "advisor") {
      navigate("/advisor-dashboard");
    } else if (role === "admin") {
      navigate("/admin-dashboard");
    }
  };

  const resolveUserId = (data) => {
    const candidates = [
      data?.userId,
    ];

    const matchedValue = candidates.find(
      (value) => value !== undefined && value !== null && String(value).trim() !== ""
    );

    return matchedValue ? String(matchedValue) : "";
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

      toast.success(data.message || "Login successful");

      localStorage.setItem("role", data.role || "");
      localStorage.setItem("authEmail", email);

      const userId = resolveUserId(data);
      if (userId) {
        localStorage.setItem("userId", userId);
      } else {
        localStorage.removeItem("userId");
      }

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
      </div>
    </div>
  );
};

export default Login;
