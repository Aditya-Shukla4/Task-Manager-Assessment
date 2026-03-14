import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Placeholder component for Dashboard testing
// (We will build the actual Task Dashboard next)
const Dashboard = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h2>Protected Dashboard</h2>
    <p>Welcome! Task management UI is under construction...</p>
  </div>
);

const App = () => {
  return (
    // Wrap the entire application routing inside the AuthProvider
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes guarded by ProtectedRoute component */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback route to catch undefined paths */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
