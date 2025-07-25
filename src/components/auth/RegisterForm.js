import React, { useState } from "react";
import "../../styles/Form.css";
import { useNavigate } from "react-router-dom";

export const RegisterForm = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [form, setForm] = useState({ username: "", password: "", email: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: data.id,
              username: form.username,
              email: form.email,
            })
          );
        }
        navigate("/");
        window.location.reload();
      } else {
        const errData = await response.json();
        throw new Error(errData.message || "Register failed.");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>REGISTER</h2>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>USERNAME</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>PASSWORD</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>EMAIL</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <button type="submit">REGISTER</button>
        </div>
      </form>
    </div>
  );
};
