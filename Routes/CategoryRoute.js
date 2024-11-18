import express from "express";
import Auth from "../Middlewares/Authentication/index.js";
import Category from "../Controllers/UserController/Category.js";
import { reqFields } from "../Models/requiredFields.js";
import multer from "multer";

const routes = express.Router();
const upload = multer();

// Controllers ------------------------
const category = new Category();

// Middlewares
const authMiddleware = new Auth();

// Get All addresses


// Add category  API
routes.post(
  "/create-category",
  upload.none(),
//  authMiddleware.addressExist,
//  authMiddleware.checkFields(reqFields.address),
  async (req, res) => {
    console.log("sdsd",req.body)
    try {
      const val = await category.createCategory({
        ...req.body,
      });
    console.log("val",val)
      res.status(val.status).send(val);
    } catch (error) {

        console.log(error)
      res.status(serverError.status).send(serverError);
    }
  }
);

// Get category by Id API
routes.get(
  "/get-category-by-id/:id",
  authMiddleware.CheckObjectId,
  async (req, res) => {
    try {
      const val = await category.getCategoryById(req.params?.id);
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error fetching category by ID:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);

// Get Address by User Id API
routes.get(
  "/get-address-by-user-id/:id",
  authMiddleware.verifyToken,
  async (req, res) => {
    try {
      const val = await address.getAddressByUserId(
        req.params?.id,
      );
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error fetching category by user ID:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);

// Get Address by postal code
routes.get(
  "/get-address-by-postal-code/:code/",
  authMiddleware.verifyToken,
  async (req, res) => {
    try {
      const { code } = req.params;
      const { page, limit = 10 } = req.query;
      const val = await address.getAddressBycode(code, page, limit);
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error fetching category by user ID:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);

// Update address API
routes.put(
  "/update-category",
  upload.none(),
  authMiddleware.verifyToken,
  async (req, res) => {
    console.log("ss",req.body)
    try {
      const val = await category.updateCategory({
        ...req.body,
      });
      console.log(val)
      res.status(val.status).send(val);

    } catch (error) {
      console.error("Error updating address:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);

// Delete Address API
routes.delete(
  "/delete-category/:id",
//   authMiddleware.verifyToken,
//   authMiddleware.CheckObjectId,
//   authMiddleware.checkAuth,
  async (req, res) => {
    try {
      const val = await category.deleteCategoryById(req.params?.id);
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error deleting address:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);


//get all Category data

routes.get(
    "/get-all-category",
    authMiddleware.verifyToken,
    async (req, res) => {
      try {
        const { page, limit = 10 } = req.query;
  
        const val = await category.getAllCategory(page, limit);
        res.status(val.status).send(val);
      } catch (error) {
        res.status(serverError.status).send(serverError);
      }
    }
  );

export default routes;