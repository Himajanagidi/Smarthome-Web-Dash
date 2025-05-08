// models/userModel.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [3, "Name must be at least 3 characters long"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      match: [/^\d{10}$/, "Please fill a valid 10-digit mobile number"],
    },
  },
  { timestamps: true }
);

// Pre-save hook to hash passwords before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Create the User Model
const User = mongoose.model("User", userSchema);

// Setup Function
const setupUser = (mong_db_uri) => {
  // Connect to MongoDB
  mongoose
    .connect(mong_db_uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // Deprecated in Mongoose 6
    })
    .then(() => {
      console.log("[Server] : Connected to MongoDB for Users");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error);
    });

  // Function to add a new user
  const addUser = async (data) => {
    try {
      const user = new User(data);
      const savedUser = await user.save();
      console.log("User added successfully");
      return savedUser; // Return the created user
    } catch (error) {
      console.error("Error adding user:", error.message);
      throw error; // Propagate the error to be handled in the route
    }
  };

  // Function to read all users
  const readUsers = async () => {
    try {
      const users = await User.find({}, "-password -__v"); // Exclude sensitive fields
      return users;
    } catch (error) {
      console.error("Error reading users:", error.message);
      throw error; // Propagate the error to be handled in the route
    }
  };

  // Function to find a user by username
  const findUserByUsername = async (username) => {
    try {
      const user = await User.findOne({ user: username }, "-password -__v"); // Exclude sensitive fields
      return user;
    } catch (error) {
      console.error("Error finding user:", error.message);
      throw error; // Propagate the error to be handled in the route
    }
  };

  // Login function
  const Login = async (email, password) => {
    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("User not found");
      }
  
      // Compare the provided password with the hashed password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error("Invalid password");
      }
  
      // Return the user data excluding the password
      const { password: _, ...userData } = user.toObject(); // Exclude the password field
      return userData;
    } catch (error) {
      console.error("Error logging in:", error.message);
      throw error; // Propagate the error to be handled in the route
    }
  };

  return { addUser, readUsers, findUserByUsername,Login };
};

module.exports = setupUser;
