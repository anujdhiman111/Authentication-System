const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authenticateToken = require("../Backend/middleware/auth");

const app = express();
const PORT = 3000;

mongoose.connect(
  "mongodb+srv://adhiman111111:1234567890@internship-assignment-c.lctv5ht.mongodb.net/?retryWrites=true&w=majority",
  console.log("connection"),
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const corsOptions = {
  origin: "http://localhost:3001",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());

const User = mongoose.model("User", {
  email: String,
  phone: String,
  name: String,
  password: String,
  role: String,
  image: String,
});

app.post("/signup", async (req, res) => {
  try {
    const { email, phone, name, password, role, image } = req.body;
    console.log(req.body.image);

    if (!email || !phone || !name || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      phone,
      name,
      password: hashedPassword,
      role,
      image: image || "",
    });

    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, "Pro_Coder", {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: "Lax",
    });
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/profile", authenticateToken, async (req, res) => {
  // console.log("entered2345")
  try {
    const userDetails = await getUserDetails(req.user.userId);
    // console.log(userDetails);
    res.json({ user: userDetails });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.put("/updateUser", authenticateToken, async (req, res) => {
  try {
    console.log(req.body, "sdfghnbvcx", req.user.userId);
    const userIdToUpdate = req.body.userId || req.user.userId;

    if (userIdToUpdate !== req.user.userId && req.user.isAdmin) {
      return res.status(403).json({
        error:
          "Forbidden: You are not allowed to update this user's information",
      });
    }

    const user = await User.findById(userIdToUpdate);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (req.body.name) {
      user.name = req.body.name;
    }

    if (req.body.image) {
      user.image = req.body.image;
    }
    // await user.save();
    let newUser = await user.save();
    console.log(newUser);
    res.json({ message: "User information updated successfully" });
  } catch (error) {
    console.error("Error updating user information:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/deleteUser/:userId", authenticateToken, async (req, res) => {
  const requestingUserId = req.user.userId;
  const targetUserId = req.params.userId;

  try {
    if (req.user.role === "admin" || requestingUserId === targetUserId) {
      const user = await User.findByIdAndDelete(targetUserId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    } else {
      res.status(403).json({ error: "Forbidden" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/users", authenticateToken, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "You are not an admin" });
  }

  try {
    const users = await User.find({ role: "user" });
    console.log(users);
    res.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/logout", authenticateToken, (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logout successful" });
});

const getUserDetails = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    throw error;
  }
};

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// console.log(Math.floor(Date.now() / 1000));
