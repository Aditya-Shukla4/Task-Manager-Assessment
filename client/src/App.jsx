import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Placeholder components for routing testing
// (We will build these actual pages in the next step)
const Login = () => <div>Login Page - Work in Progress</div>;
const Register = () => <div>Register Page - Work in Progress</div>;
const Dashboard = () => (
  <div>Protected Dashboard - Only for Logged In Users!</div>
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
