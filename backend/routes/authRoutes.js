const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

/*
  CREATE ADMIN ACCOUNT
  POST /api/auth/setup
*/
router.post("/setup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin account already exists",
      });
    }

    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin setup error:", error.message);

    res.status(500).json({
      message: "Failed to create admin",
      error: error.message,
    });
  }
});

/*
  ADMIN LOGIN
  POST /api/auth/login
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    let isPasswordCorrect = false;

    /*
      Supports both:
      1. Old plain-text password stored in MongoDB
      2. New bcrypt-hashed password
    */

    if (admin.password.startsWith("$2")) {
      // Password is already bcrypt hashed
      isPasswordCorrect = await bcrypt.compare(
        password,
        admin.password
      );
    } else {
      // Password is currently plain text
      isPasswordCorrect = password === admin.password;

      // If correct, convert it to a secure bcrypt hash
      if (isPasswordCorrect) {
        admin.password = await bcrypt.hash(password, 10);
        await admin.save();
      }
    }

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is missing in environment variables",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

module.exports = router;