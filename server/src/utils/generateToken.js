const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (res, userId) => {
  // Creationg Token 
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // HTTP-Only Cookie set
  res.cookie("jwt", token, {
    httpOnly: true, //save from XSS attack
    secure: process.env.NODE_ENV !== "development", // HTTPS in production
    sameSite: "strict", // secure from CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

module.exports = generateTokenAndSetCookie;
