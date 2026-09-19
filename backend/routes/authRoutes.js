const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

/* =====================================================
   CREATE ADMIN ACCOUNT
   POST /api/auth/setup
===================================================== */

router.post("/setup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin account already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error("Admin setup error:", error);

    return res.status(500).json({
      message: "Failed to create admin",
      error: error.message,
    });
  }
});


/* =====================================================
   ADMIN LOGIN
   POST /api/auth/login
===================================================== */

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Find admin
    const admin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    let passwordCorrect = false;

    /* ---------------------------------------------
       Check password
       Supports:
       1. Old plain-text password
       2. New bcrypt password
    --------------------------------------------- */

    if (admin.password.startsWith("$2")) {
      // Password is already bcrypt hashed

      passwordCorrect = await bcrypt.compare(
        password,
        admin.password
      );
    } else {
      // Old plain-text password

      passwordCorrect = password === admin.password;

      // Convert old password to bcrypt
      if (passwordCorrect) {
        admin.password = await bcrypt.hash(password, 10);
        await admin.save();

        console.log("Admin password converted to bcrypt");
      }
    }

    // Wrong password
    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    /* ---------------------------------------------
       Check JWT_SECRET
    --------------------------------------------- */

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing");

      return res.status(500).json({
        message: "JWT_SECRET is missing in environment variables",
      });
    }

    /* ---------------------------------------------
       Create JWT token
    --------------------------------------------- */

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

    /* ---------------------------------------------
       Successful login
    --------------------------------------------- */

    return res.status(200).json({
      message: "Login successful",

      token,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});


/* =====================================================
   EXPORT ROUTER
===================================================== */

module.exports = router;