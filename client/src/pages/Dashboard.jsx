import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import axiosInstance from "../api/axios";
import { TASK_ENDPOINTS } from "../api/endpoints";
import { decryptPayload } from "../utils/encryption";

/* ── helpers ── */
const STATUS_CYCLE = ["Pending", "In Progress", "Completed"];

const badgeClass = (status) => {
  if (status === "Completed") return "badge badge-completed";
  if (status === "In Progress") return "badge badge-progress";
  return "badge badge-pending";
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/* ── component ── */
const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [creating, setCreating] = useState(false);

  /* derived stats */
  const pendingCount = tasks.filter((t) => t.status === "Pending").length;
  const progressCount = tasks.filter((t) => t.status === "In Progress").length;
  const completedCount = tasks.filter((t) => t.status === "Completed").length;

  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter]);

  const fetchTasks = async (searchQuery = search) => {
    setLoading(true);
    setError("");
    try {
      let query = `?page=${page}&limit=6`;
      if (statusFilter) query += `&status=${statusFilter}`;
      if (searchQuery) query += `&search=${encodeURIComponent(searchQuery)}`;

      const res = await axiosInstance.get(`${TASK_ENDPOINTS.GET_ALL}${query}`);
      const decrypted = decryptPayload(res.data.encryptedData);
      setTasks(decrypted.tasks);
      setTotalPages(decrypted.pages);
      setTotalTasks(decrypted.total);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTasks(search);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Task title is required");
    setCreating(true);
    setError("");
    try {
      await axiosInstance.post(TASK_ENDPOINTS.CREATE, { title, description });
      setTitle("");
      setDescription("");
      setPage(1);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await axiosInstance.delete(TASK_ENDPOINTS.DELETE(id));
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete task");
    }
  };

  const handleStatusCycle = async (id, current) => {
    const next =
      STATUS_CYCLE[(STATUS_CYCLE.indexOf(current) + 1) % STATUS_CYCLE.length];
    try {
      await axiosInstance.put(TASK_ENDPOINTS.UPDATE(id), { status: next });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status");
    }
  };

  return (
    <>
      <div className="bg-mesh" />

      <div className="page">
        <div className="container">
          {/* ── Header ── */}
          <div className="glass-static dash-header animate-fadeUp">
            <div className="dash-header-left">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  className="auth-logo-icon"
                  style={{
                    width: 32,
                    height: 32,
                    fontSize: 14,
                    borderRadius: 8,
                  }}
                >
                  ✦
                </div>
                <span className="dash-title">TaskFlow</span>
              </div>
              <span className="dash-subtitle" style={{ marginTop: 4 }}>
                Welcome back, <span>{user?.name || "User"}</span>
              </span>
            </div>
            <div className="dash-header-right">
              <button
                className="theme-toggle"
                onClick={toggleTheme}
                title="Toggle theme"
              >
                <div className="theme-toggle-thumb">
                  {theme === "dark" ? "☀️" : "🌙"}
                </div>
              </button>
              <button className="btn btn-danger" onClick={logout}>
                Sign out
              </button>
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="stats-row animate-fadeUp delay-1">
            <div className="stat-card glass">
              <span className="stat-label">Total</span>
              <span className="stat-value accent">{totalTasks}</span>
            </div>
            <div className="stat-card glass">
              <span className="stat-label">In Progress</span>
              <span className="stat-value warning">{progressCount}</span>
            </div>
            <div className="stat-card glass">
              <span className="stat-label">Done</span>
              <span className="stat-value success">{completedCount}</span>
            </div>
          </div>

          {/* ── Error ── */}
          {error && (
            <div
              className="alert alert-error animate-slideDown"
              style={{ marginBottom: 14 }}
            >
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── Create Task ── */}
          <div className="glass-static create-form animate-fadeUp delay-2">
            <p className="create-form-title">New task</p>
            <form onSubmit={handleCreate}>
              <div className="create-form-row">
                <input
                  className="input"
                  type="text"
                  placeholder="Task title (required)"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <input
                  className="input"
                  type="text"
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flexShrink: 0, padding: "11px 20px" }}
                  disabled={creating}
                >
                  {creating ? (
                    <div
                      className="spinner"
                      style={{ width: 16, height: 16 }}
                    />
                  ) : (
                    "+ Add"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* ── Filters ── */}
          <div className="glass-static filter-bar animate-fadeUp delay-3">
            <form onSubmit={handleSearch} className="filter-search">
              <input
                className="input"
                type="text"
                placeholder="Search by title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-ghost"
                style={{ padding: "10px 16px", flexShrink: 0 }}
              >
                Search
              </button>
            </form>
            <select
              className="filter-select"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">All statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* ── Task List ── */}
          {loading ? (
            <div className="loading-center glass-static animate-fadeIn">
              <div className="spinner" style={{ width: 28, height: 28 }} />
              <span>Loading tasks…</span>
            </div>
          ) : (
            <div className="task-list animate-fadeIn">
              {tasks.length === 0 ? (
                <div className="glass-static empty-state">
                  <div className="empty-icon">📋</div>
                  <p className="empty-title">No tasks found</p>
                  <p className="empty-desc">
                    {statusFilter || search
                      ? "Try adjusting your filters"
                      : "Create your first task above to get started"}
                  </p>
                </div>
              ) : (
                tasks.map((task, i) => (
                  <div
                    key={task._id}
                    className="glass task-card"
                    style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}
                  >
                    <div className="task-card-left">
                      <div className="task-card-title">{task.title}</div>
                      {task.description && (
                        <div className="task-card-desc">{task.description}</div>
                      )}
                      <div className="task-card-meta">
                        <span>📅</span>
                        <span>{formatDate(task.createdAt)}</span>
                      </div>
                    </div>
                    <div className="task-card-right">
                      <button
                        className={badgeClass(task.status)}
                        onClick={() => handleStatusCycle(task._id, task.status)}
                        title="Click to cycle status"
                      >
                        {task.status}
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() => handleDelete(task._id)}
                        title="Delete task"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                          <path d="M10 11v6M14 11v6" />
                          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="pagination animate-fadeUp">
              <button
                className="btn btn-ghost"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                style={{ opacity: page === 1 ? 0.4 : 1 }}
              >
                ← Prev
              </button>
              <span className="page-info">
                {page} / {totalPages}
              </span>
              <button
                className="btn btn-ghost"
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                style={{ opacity: page === totalPages ? 0.4 : 1 }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
