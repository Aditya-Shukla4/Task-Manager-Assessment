import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Extract register function from our global context
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    // Strict frontend validation
    if (!name || !email || !password) {
      return setError("Please fill in all fields");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters long");
    }

    try {
      // Call the register function from context
      const success = await register(name, email, password);
      if (success) {
        // Redirect directly to dashboard; context automatically logs them in
        navigate("/dashboard");
      } else {
        setError("Registration failed");
      }
    } catch (err) {
      // Catch and display backend errors (e.g., "User already exists")
      setError(
        err.response?.data?.error || "Registration failed. Please try again.",
      );
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
      <h2>Register</h2>
      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "5px" }}
            required
          />
        </div>
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
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </form>

      <p style={{ marginTop: "15px", textAlign: "center" }}>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
