import express from "express";
import Auth from "../Middlewares/Authentication/index.js";
import Source from "../Controllers/SourceController/Source.js";
import { reqFields } from "../Models/requiredFields.js";
import multer from "multer";

const routes = express.Router();
const upload = multer();

// Controllers ------------------------
const source = new Source();

// Middlewares
const authMiddleware = new Auth();




// Add qualification  API
routes.post(
  "/create-source",
  upload.none(),
//  authMiddleware.addressExist,
//  authMiddleware.checkFields(reqFields.address),
  async (req, res) => {
    console.log("sdsd",req.body)
    try {
      const val = await source.createSource({
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
  "/get-source-by-id/:id",
  authMiddleware.CheckObjectId,
  async (req, res) => {
    try {
      const val = await source.getSourceById(req.params?.id);
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
      const val = await Source.getAddressByUserId(
        req.params?.id,
      );
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error fetching category by user ID:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);



// Update address API
routes.put(
  "/update-source",
  upload.none(),
  authMiddleware.verifyToken,
  async (req, res) => {
    console.log("ss",req.body)
    try {
      const val = await source.updateSource({
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
  "/delete-source/:id",
//   authMiddleware.verifyToken,
//   authMiddleware.CheckObjectId,
//   authMiddleware.checkAuth,
  async (req, res) => {
    try {
      const val = await source.deleteSourceById(req.params?.id);
      res.status(val.status).send(val);
    } catch (error) {
      console.error("Error deleting address:", error.message);
      res.status(serverError.status).send(serverError);
    }
  }
);


//get all Category data

routes.get(
    "/get-all-source",
    authMiddleware.verifyToken,
    async (req, res) => {
      try {
        const { page, limit = 10 } = req.query;
  
        const val = await source.getSource(page, limit);
        res.status(val.status).send(val);
      } catch (error) {
        res.status(serverError.status).send(serverError);
      }
    }
  );

export default routes;