const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    status: {
      type: String,
      enum: {
        values: ["Pending", "In Progress", "Completed"],
        message: "{VALUE} is not a valid status",
      },
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

// Performance index — all task queries filter by user
taskSchema.index({ user: 1 });

// Compound index for filtered queries (user + status together)
taskSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Task", taskSchema);
