import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Extract login function from our global context
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors on new submission

    // Basic frontend validation to avoid unnecessary API calls
    if (!email || !password) {
      return setError("Please fill in all fields");
    }

    try {
      // Call the login function from context
      const success = await login(email, password);
      if (success) {
        // Redirect to protected dashboard upon successful login
        navigate("/dashboard");
      } else {
        setError("Invalid credentials or decryption failed");
      }
    } catch (err) {
      // Display error message directly from the backend response
      setError(err.response?.data?.error || "Login failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Login</h2>
      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
