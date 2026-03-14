const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      // Token verify kiya
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // fetching user from DB
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ error: "Not authorized, user no longer exists" });
      }

      next();
    } catch (error) {
      console.error("Token Verification Failed:", error.message);
      res.status(401).json({ error: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ error: "Not authorized, no token provided" });
  }
};

module.exports = { protect };
