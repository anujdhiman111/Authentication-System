const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log("entered22",token)
  if (!token) {
    // console.log("token")
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const decodedUser = jwt.verify(token, "Pro_Coder");
    if (decodedUser.exp && decodedUser.exp < Math.floor(Date.now() / 1000)) {
      return res.status(401).json({ error: "Token has expired" });
    }
    req.user = decodedUser;
    if (decodedUser.role === "admin") {
      req.isAdmin = "admin";
    }
    // console.log("data")
    console.log(decodedUser);
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized" });
  }
};
module.exports = authenticateToken;
