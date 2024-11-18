import express from "express";
import Auth from "../Middlewares/Authentication/index.js";
import Address from "../Controllers/UserController/Address.js";
import { reqFields } from "../Models/requiredFields.js";
import multer from "multer";

const routes = express.Router();
const upload = multer();

// Controllers ------------------------
const address = new Address();

// Middlewares
const authMiddleware = new Auth();

// Get All addresses


// Add address API
routes.post(
  "/create-address",
  upload.none(),
//  authMiddleware.addressExist,
//  authMiddleware.checkFields(reqFields.address),
  async (req, res) => {
    try {
      const val = await address.createAddress({
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

// Get Address by Id API
routes.get(
  "/get-address-by-id/:id",
  authMiddleware.CheckObjectId,
  async (req, res) => {
    try {
      const val = await address.getAddressById(req.params?.id);
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error fetching address by ID:", error.message);
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
      console.error("Error fetching address by user ID:", error.message);
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
      console.error("Error fetching address by user ID:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);

// Update address API
routes.put(
  "/update-address",
  upload.none(),
  authMiddleware.verifyToken,
  async (req, res) => {
    try {
      const val = await address.updateAddress({
        ...req.body,
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
  "/delete-address/:id",
//   authMiddleware.verifyToken,
//   authMiddleware.CheckObjectId,
//   authMiddleware.checkAuth,
  async (req, res) => {
    try {
      const val = await address.deleteAddressById(req.params?.id);
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error deleting address:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);

export default routes;