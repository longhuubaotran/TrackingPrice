const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = async (req, res, next) => {
  try {
    const token = req.get("Authorization");
    if (!token) {
      return res.status(401).json("No Token");
    }

    const decodedToken = jwt.verify(token, config.get("jwtsecret"));

    req.userId = decodedToken.userId;

    next();
  } catch (err) {
    res.status(401).json("Token is not valid");
  }
};
