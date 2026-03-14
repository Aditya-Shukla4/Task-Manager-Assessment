import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password)
      return setError("Please fill in all fields");
    if (password.length < 6)
      return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const success = await register(name, email, password);
      if (success) navigate("/dashboard");
      else setError("Registration failed. Please try again.");
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-mesh" />

      {/* Theme toggle */}
      <div className="theme-toggle-fixed">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title="Toggle theme"
        >
          <div className="theme-toggle-thumb">
            {theme === "dark" ? "☀️" : "🌙"}
          </div>
        </button>
      </div>

      <div className="auth-page">
        <div className="auth-card glass animate-scaleIn">
          {/* Logo */}
          <div className="auth-logo">
            <div className="auth-logo-icon">✦</div>
            <span className="auth-logo-text">TaskFlow</span>
          </div>

          <h1 className="auth-heading animate-fadeUp delay-1">
            Create account
          </h1>
          <p className="auth-subheading animate-fadeUp delay-2">
            Start organizing your work today
          </p>

          {error && (
            <div
              className="alert alert-error animate-slideDown"
              style={{ marginBottom: 16 }}
            >
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="input-group animate-fadeUp delay-2">
              <label className="input-label">Full name</label>
              <input
                className="input"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="input-group animate-fadeUp delay-3">
              <label className="input-label">Email address</label>
              <input
                className="input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group animate-fadeUp delay-4">
              <label className="input-label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary animate-fadeUp delay-5"
              style={{
                width: "100%",
                padding: "13px",
                fontSize: 15,
                marginTop: 4,
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 16, height: 16 }} />
                  Creating account…
                </>
              ) : (
                "Create account →"
              )}
            </button>
          </form>

          <p className="auth-footer animate-fadeUp delay-5">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
