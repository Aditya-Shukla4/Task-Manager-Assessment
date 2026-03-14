const User = require("../models/User");
const generateTokenAndSetCookie = require("../utils/generateToken");
const { encryptPayload } = require("../utils/encryption");

// @desc    Register a new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation - Never trust user input!
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "All fields are strictly required" }); // Proper HTTP status
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create user
    const user = await User.create({ name, email, password });

    if (user) {
      generateTokenAndSetCookie(res, user._id); // Token in HttpOnly cookie

      const safeData = encryptPayload({
        _id: user._id,
        name: user.name,
        email: user.email,
      });

      res.status(201).json({ encryptedData: safeData });
    } else {
      res.status(400).json({ error: "Invalid user data received" });
    }
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      generateTokenAndSetCookie(res, user._id); // JWT based auth [cite: 11]

      // Response payload encrypt kiya
      const safeData = encryptPayload({
        _id: user._id,
        name: user.name,
        email: user.email,
      });

      res.status(200).json({ encryptedData: safeData });
    } else {
      res.status(401).json({ error: "Invalid email or password" }); // 401 Unauthorized
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
const logoutUser = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };
