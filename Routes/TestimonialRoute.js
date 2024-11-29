import express from "express";
import Auth from "../Middlewares/Authentication/index.js";
import Testimonial from "../Controllers/TestimonialsController/Testimonials.js";
import { reqFields } from "../Models/requiredFields.js";
import multer from "multer";
import path from "path";

const routes = express.Router();

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Make sure the directory exists
    cb(null, "uploads/video"); // Make sure 'uploads/userprofile' folder exists
  },
  filename: function (req, file, cb) {
    // Ensure full name is available in req.body
    const fullName = req.body.name
      ? req.body.name.replace(/\s+/g, "-")
      : "default-name"; // Replace spaces with hyphens

    // Create a unique filename with full name, timestamp, and random number
    const uniqueName = `${fullName}-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}${path.extname(file.originalname)}`;

    // Set the filename
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept video files only
  if (!file.originalname.match(/\.(mp4|mkv|avi|mov|webm)$/i)) {
    return cb(new Error("Only video files are allowed!"), false);
  }
  cb(null, true);
};

// Create multer instance with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for videos, adjust as necessary
  },
});
// Controllers ------------------------
const testimonial = new Testimonial();

// Middlewares
const authMiddleware = new Auth();

// Get All addresses
routes.get(
  "/get-all-testimonials",
  // authMiddleware.verifyToken,
  async (req, res) => {
    try {
      const { page, limit = 10 } = req.query;
      const val = await testimonial.getTestimonial(page, limit);
      res.status(val.status).send(val);
    } catch (error) {
      console.log(error);
      res.status(serverError.status).send(serverError);
    }
  }
);

// Add address API
routes.post(
  "/create-testimonials",
  upload.single("video"),
  //  authMiddleware.addressExist,
  //  authMiddleware.checkFields(reqFields.address),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).send({
        status: 400,
        message: "No file uploaded",
      });
    }

    const testiData = {
      ...req.body,
      video: req.file.path, // or `uploads/${req.file.filename}`
    };
    try {
      const val = await testimonial.createTestimonial({
        ...testiData,
      });
      console.log("val", val);
      res.status(val.status).send(val);
    } catch (error) {
      console.log(error);
      res.status(serverError.status).send(serverError);
    }
  }
);

// Get Address by Id API
routes.get(
  "/get-testimonial-by-id/:id",
  authMiddleware.CheckObjectId,
  async (req, res) => {
    try {
      const val = await testimonial.getTestimonialByUserId(req.params?.id);
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error fetching address by ID:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);

// Update address API
routes.put(
  "/update-testimonial",
  upload.single("video"),
  //authMiddleware.verifyToken,
  async (req, res) => {
    const testiData = {
      ...req.body,
      video: req.file.path, // or `uploads/${req.file.filename}`
    };
    try {
      const val = await testimonial.updateTestimonial({
        ...testiData,
      });
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error updating address:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);

// Delete Address API
routes.delete(
  "/delete-testimonial/:id",
  //   authMiddleware.verifyToken,
  //   authMiddleware.CheckObjectId,
  //   authMiddleware.checkAuth,
  async (req, res) => {
    try {
      const val = await testimonial.deleteTestimonialById(req.params?.id);
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error deleting testimonials :", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);

export default routes;
