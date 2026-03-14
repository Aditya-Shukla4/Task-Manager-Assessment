import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return setError("Please fill in all fields");

    setLoading(true);
    try {
      const success = await login(email, password);
      if (success) navigate("/dashboard");
      else setError("Invalid credentials or decryption failed");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
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

          <h1 className="auth-heading animate-fadeUp delay-1">Welcome back</h1>
          <p className="auth-subheading animate-fadeUp delay-2">
            Sign in to your workspace
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

            <div className="input-group animate-fadeUp delay-3">
              <label className="input-label">Password</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary animate-fadeUp delay-4"
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
                  Signing in…
                </>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>

          <p className="auth-footer animate-fadeUp delay-5">
            Don't have an account? <Link to="/register">Create one now</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
