import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import { TASK_ENDPOINTS } from "../api/endpoints";
import { decryptPayload } from "../utils/encryption"; // ADD THIS

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [page, statusFilter]);

  const fetchTasks = async (searchQuery = search) => {
    setLoading(true);
    setError("");
    try {
      let query = `?page=${page}&limit=5`;
      if (statusFilter) query += `&status=${statusFilter}`;
      if (searchQuery) query += `&search=${searchQuery}`;

      const res = await axiosInstance.get(`${TASK_ENDPOINTS.GET_ALL}${query}`);

      // FIX: Decrypt the response since backend now encrypts task data
      const decrypted = decryptPayload(res.data.encryptedData);
      setTasks(decrypted.tasks);
      setTotalPages(decrypted.pages);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTasks(search);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Task title is strictly required");

    try {
      await axiosInstance.post(TASK_ENDPOINTS.CREATE, { title, description });
      setTitle("");
      setDescription("");
      setPage(1);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create task");
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axiosInstance.delete(TASK_ENDPOINTS.DELETE(id));
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete task");
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const statuses = ["Pending", "In Progress", "Completed"];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    try {
      await axiosInstance.put(TASK_ENDPOINTS.UPDATE(id), {
        status: nextStatus,
      });
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update status");
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Task Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">
              Welcome back,{" "}
              <span className="font-semibold text-blue-600">
                {user?.name || "User"}
              </span>
              !
            </p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Create Task Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Create New Task
          </h3>
          <form
            onSubmit={handleCreateTask}
            className="flex flex-col sm:flex-row gap-4"
          >
            <input
              type="text"
              placeholder="Task Title (Required)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              required
            />
            <input
              type="text"
              placeholder="Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-[2] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm whitespace-nowrap"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
            <input
              type="text"
              placeholder="Search tasks by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
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
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
          >
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Task List */}
        {loading ? (
          <div className="text-center py-10 text-gray-500 font-medium">
            Loading tasks...
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">
                  No tasks found. Start by creating one above!
                </p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">
                      {task.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {task.description}
                    </p>
                    <div className="text-xs text-gray-400 mt-2 font-medium">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleStatusUpdate(task._id, task.status)}
                      className={`px-3 py-1 rounded-full text-xs font-bold border cursor-pointer hover:opacity-80 transition-opacity ${getStatusStyle(task.status)}`}
                      title="Click to change status"
                    >
                      {task.status}
                    </button>
                    <button
                      onClick={() => handleDeleteTask(task._id)}
                      className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-md hover:bg-red-50"
                      title="Delete Task"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
            >
              Previous
            </button>
            <span className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
