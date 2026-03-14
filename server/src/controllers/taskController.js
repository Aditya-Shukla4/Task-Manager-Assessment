const Task = require("../models/Task");

// @desc    Create a new task
// @route   POST /api/tasks
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ error: "Task title is strictly required" });
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
    });

    res.status(201).json(task);
  } catch (error) {
    console.error("Create Task Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Get all tasks for logged-in user (with Pagination, Filter, Search)
// @route   GET /api/tasks
const getTasks = async (req, res) => {
  try {
    // Pagination logic [cite: 19]
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { user: req.user._id };

    // Filter by status [cite: 20]
    if (req.query.status) {
      query.status = req.query.status;
    }

    if (req.query.search) {
      query.title = { $regex: req.query.search, $options: "i" };
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalTasks = await Task.countDocuments(query);

    res.status(200).json({
      tasks,
      page,
      pages: Math.ceil(totalTasks / limit),
      total: totalTasks,
    });
  } catch (error) {
    console.error("Get Tasks Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // SABSE IMPORTANT SECURITY CHECK: Make sure user owns the task
    if (task.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "User not authorized to update this task" });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Update Task Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // SECURITY CHECK
    if (task.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "User not authorized to delete this task" });
    }

    await task.deleteOne();

    res.status(200).json({ message: "Task removed successfully" });
  } catch (error) {
    console.error("Delete Task Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
