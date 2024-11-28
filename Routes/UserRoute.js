import express from "express";
import User from "../Controllers/UserController/Users.js";
import { noIfsc, serverError, signUp } from "../Responses/index.js";
import Auth from "../Middlewares/Authentication/index.js";
import multer from "multer";
import path from "path";
const routes = express.Router();
//const upload = multer();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/userprofile"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    // Ensure full name is available in req.body
    const fullName = req.body.fullName
      ? req.body.fullName.replace(/\s+/g, "-")
      : "default-name"; // Replace spaces with hyphens

    // Create a unique filename with full name, timestamp, and random number
    const uniqueName = `${fullName}-${Date.now()}-${path.extname(
      file.originalname
    )}`;

    // Set the filename
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Create multer instance with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
// Controllers
const userController = new User();
const authMiddleware = new Auth();

//user registration api
routes.post(
  "/register-user",
  upload.single("image"),
  authMiddleware.userExists,
  authMiddleware.checkPassword,
  async (req, res) => {
    //check for profile image
    if (!req.file) {
      return res.status(400).send({
        status: 400,
        message: "No file uploaded",
      });
    }

    const userData = {
      ...req.body,
      image: req.file.path, // or `uploads/${req.file.filename}`
    };
    try {
      const result = await userController.register(userData);

      return res.status(result.status).send(result);
    } catch (error) {
      console.log("error", error);
      return res.status(serverError.status).send({
        ...serverError,
        error,
      });
    }
  }
);

// User Login API
routes.post(
  "/login",
  upload.none(),
  authMiddleware.checkFields(["email", "password"]),
  authMiddleware.checkPassword,
  userController.login
);

// Update User API
routes.put(
  "/update-user",
  upload.single("image"),
  authMiddleware.verifyToken,
  async (req, res) => {
    //check for profile image
    if (!req.file) {
      return res.status(400).send({
        status: 400,
        message: "No file uploaded",
      });
    }

    const userData = {
      ...req.body,
      image: req.file.path, // or `uploads/${req.file.filename}`
    };

    try {
      const val = await userController.update({
        ...userData,
      });
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error updating address:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);

routes.delete(
  "/delete-User/:id",
  authMiddleware.verifyToken,

  async (req, res) => {
    try {
      const val = await userController.deleteUser(req.params?.id);
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error deleting User:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);

// get user by Id
routes.get(
  "/get-user-by-id/:id",
  authMiddleware.verifyToken,
  async (req, res) => {
    try {
      const val = await userController.getUserById(req.params?.id);
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error fetching User by user ID:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);

//get all user data

routes.get("/get-all-user", authMiddleware.verifyToken, async (req, res) => {
  try {
    const { page, limit = 10 } = req.query;

    const val = await userController.getAllUser(page, limit);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

export default routes;
