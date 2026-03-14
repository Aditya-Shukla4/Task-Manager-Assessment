import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import { TASK_ENDPOINTS } from "../api/endpoints";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  // State management for tasks and UI
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State for creating a new task
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // State for filtering, searching, and pagination as per assessment requirements
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch tasks whenever dependencies change (page, search term, or status filter)
  useEffect(() => {
    fetchTasks();
    // We use a debounce concept in real apps, but for this 24-hour challenge,
    // tying it directly to button clicks or state updates is fine.
  }, [page, statusFilter]);
  // Intentionally leaving 'search' out of dependency array so it only triggers on form submit to prevent spamming the API

  const fetchTasks = async (searchQuery = search) => {
    setLoading(true);
    setError("");
    try {
      // Build the query string dynamically
      let query = `?page=${page}&limit=5`;
      if (statusFilter) query += `&status=${statusFilter}`;
      if (searchQuery) query += `&search=${searchQuery}`;

      const res = await axiosInstance.get(`${TASK_ENDPOINTS.GET_ALL}${query}`);

      setTasks(res.data.tasks);
      setTotalPages(res.data.pages);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1); // Reset to first page when searching
    fetchTasks(search);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Task title is strictly required");

    try {
      await axiosInstance.post(TASK_ENDPOINTS.CREATE, { title, description });
      setTitle("");
      setDescription("");
      setPage(1); // Go back to page 1 to see the new task
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create task");
    }
  };

  const handleDeleteTask = async (id) => {
    // Confirm before critical destructive actions
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axiosInstance.delete(TASK_ENDPOINTS.DELETE(id));
      fetchTasks(); // Refresh list after deletion
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete task");
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    // Simple status toggle logic for the UI (Pending -> In Progress -> Completed -> Pending)
    const statuses = ["Pending", "In Progress", "Completed"];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
      await axiosInstance.put(TASK_ENDPOINTS.UPDATE(id), {
        status: nextStatus,
      });
      fetchTasks(); // Refresh list to reflect changes
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status");
    }
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2>Welcome, {user?.name || "User"}!</h2>
        <button
          onClick={logout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
      )}

      {/* Task Creation Form */}
      <div
        style={{
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          marginBottom: "30px",
        }}
      >
        <h3>Create New Task</h3>
        <form
          onSubmit={handleCreateTask}
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          <input
            type="text"
            placeholder="Task Title (Required)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ flex: "1", padding: "8px" }}
            required
          />
          <input
            type="text"
            placeholder="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ flex: "2", padding: "8px" }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Filters and Search - Core Requirement */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <form
          onSubmit={handleSearchSubmit}
          style={{ display: "flex", flex: "1", gap: "5px" }}
        >
          <input
            type="text"
            placeholder="Search tasks by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Search
          </button>
        </form>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          style={{ padding: "8px" }}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Task List Rendering */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {tasks.length === 0 ? (
            <p>No tasks found. Create one above!</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                style={{
                  padding: "15px",
                  border: "1px solid #eee",
                  borderRadius: "8px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <h4 style={{ margin: "0 0 5px 0" }}>{task.title}</h4>
                  <p
                    style={{
                      margin: "0 0 10px 0",
                      color: "#666",
                      fontSize: "14px",
                    }}
                  >
                    {task.description}
                  </p>
                  <small style={{ color: "#888" }}>
                    Created: {new Date(task.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center" }}
                >
                  {/* Click to toggle status directly */}
                  <span
                    onClick={() => handleStatusUpdate(task._id, task.status)}
                    style={{
                      padding: "5px 10px",
                      borderRadius: "12px",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      backgroundColor:
                        task.status === "Completed"
                          ? "#d4edda"
                          : task.status === "In Progress"
                            ? "#fff3cd"
                            : "#f8d7da",
                      color:
                        task.status === "Completed"
                          ? "#155724"
                          : task.status === "In Progress"
                            ? "#856404"
                            : "#721c24",
                    }}
                    title="Click to change status"
                  >
                    {task.status}
                  </span>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination Controls - Core Requirement */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "30px",
          }}
        >
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            style={{
              padding: "8px 16px",
              cursor: page === 1 ? "not-allowed" : "pointer",
            }}
          >
            Previous
          </button>
          <span style={{ padding: "8px" }}>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            style={{
              padding: "8px 16px",
              cursor: page === totalPages ? "not-allowed" : "pointer",
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
