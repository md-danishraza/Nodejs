const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

// fn to create JWT
function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    profileImageURL: user.profileImageURL,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
  };

  return jwt.sign(payload, secret, { expiresIn: "1h" });
}

// fn to verify JWT
function validateToken(token) {
  try {
    const decoded = jwt.verify(token, secret);
    return decoded;
  } catch (error) {
    return null;
  }
}

module.exports = { createTokenForUser, validateToken };
