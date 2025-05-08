// server/setups/User_setup.js
const express = require("express");
const {addUser, readUsers, findUserByUsername} = require('./setupUser')
/**
 * Sets up user-related API routes.
 *
 * @param {Function} addUser - Function to add a new user.
 * @param {Function} readUsers - Function to read all users.
 * @param {Function} findUserByUsername - Function to find a user by username.
 * @returns {express.Router} - Configured Express router.
 */
const setupUserRoutes = (addUser, readUsers, findUserByUsername,Login) => {
  const router = express.Router();

  /**
   * @route   POST /adduser
   * @desc    Add a new user
   * @access  Public
   */
  router.post("/adduser", async (req, res) => {
    try {
      const { data } = req.body;
      console.log(data,"knvksnflsnbn")

      // Validate input data
      if (!data) {
        return res.status(400).json({ error: "User data is required." });
      }

      const { user, name, password, email, mobileNumber } = data;

      if (!user || !name || !password || !email || !mobileNumber) {
        return res
          .status(400)
          .json({ error: "All user fields are required." });
      }

      // Add the user
      const createdUser = await addUser(data);

      // Respond with the created user data (excluding sensitive fields)
      res.status(201).json({
        message: "User added successfully.",
        user: {
          user: createdUser.user,
          name: createdUser.name,
          email: createdUser.email,
          mobileNumber: createdUser.mobileNumber,
          createdAt: createdUser.createdAt,
          updatedAt: createdUser.updatedAt,
        },
      });
    } catch (error) {
      // Handle duplicate key errors
      if (error.code === 11000) {
        const duplicatedField = Object.keys(error.keyValue)[0];
        return res
          .status(409)
          .json({ error: `${duplicatedField} already exists.` });
      }

      // Handle validation errors
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((val) => val.message);
        return res.status(400).json({ error: messages.join(", ") });
      }

      // Handle other errors
      console.error("Error adding user:", error);
      res.status(500).json({ error: "Server error." });
    }
  });

  /**
   * @route   GET /getuser
   * @desc    Get all users
   * @access  Public
   */
  router.get("/getuser", async (req, res) => {
    try {
      const users = await readUsers();

      // Respond with users data
      res.status(200).json(users);
    } catch (error) {
      console.error("Error reading users:", error);
      res.status(500).json({ error: "Server error." });
    }
  });

  /**
   * @route   GET /findUserByUsername/:username
   * @desc    Find a user by username
   * @access  Public
   */
  router.get("/findUserByUsername/:username", async (req, res) => {
    try {
      const { username } = req.params;

      if (!username) {
        return res
          .status(400)
          .json({ error: "Username parameter is required." });
      }

      const user = await findUserByUsername(username);

      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }

      // Respond with user data (excluding sensitive fields)
      res.status(200).json({
        user: {
          user: user.user,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error) {
      console.error("Error finding user:", error);
      res.status(500).json({ error: "Server error." });
    }
  });

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }
  
    try {
      // Call the Login function
      const user = await Login(email, password);
  
      // Return success response with user data
      res.status(200).json({ success: true, message: "Login successful", user });
    } catch (error) {
      // Handle errors (e.g., invalid credentials or internal server error)
      res.status(400).json({ success: false, message: error.message });
    }
  });

  return router;
};

module.exports = setupUserRoutes;
