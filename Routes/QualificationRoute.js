import express from "express";
import Auth from "../Middlewares/Authentication/index.js";
import Qualification from "../Controllers/UserController/Qualification.js";
import { reqFields } from "../Models/requiredFields.js";
import multer from "multer";

const routes = express.Router();
const upload = multer();

// Controllers ------------------------
const qualification = new Qualification();

// Middlewares
const authMiddleware = new Auth();

// Get All addresses


// Add qualification  API
routes.post(
  "/create-qualification",
  upload.none(),
//  authMiddleware.addressExist,
//  authMiddleware.checkFields(reqFields.address),
  async (req, res) => {
    console.log("sdsd",req.body)
    try {
      const val = await qualification.createQualification({
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

// Get qualification by Id API
routes.get(
  "/get-qualification-by-id/:id",
  authMiddleware.CheckObjectId,
  async (req, res) => {
    try {
      const val = await qualification.getQualificationById(req.params?.id);
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
  "/update-qualification",
  upload.none(),
  authMiddleware.verifyToken,
  async (req, res) => {
    console.log("ss",req.body)
    try {
      const val = await qualification.updateQualification({
        ...req.body,
      });
      console.log(val)
      res.status(val.status).send(val);

    } catch (error) {
      console.error("Error updating qualification:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);

// Delete Address API
routes.delete(
  "/delete-qualification/:id",
//   authMiddleware.verifyToken,
//   authMiddleware.CheckObjectId,
//   authMiddleware.checkAuth,
  async (req, res) => {
    try {
      const val = await qualification.deleteQualificationById(req.params?.id);
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error deleting address:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);


//get all Category data

routes.get(
    "/get-all-qualification",
    authMiddleware.verifyToken,
    async (req, res) => {
      try {
        const { page, limit = 10 } = req.query;
  
        const val = await qualification.getQualification(page, limit);
        res.status(val.status).send(val);
      } catch (error) {
        res.status(serverError.status).send(serverError);
      }
    }
  );

export default routes;