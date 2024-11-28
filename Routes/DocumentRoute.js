import express from "express";
import DocumentDetails from "../Controllers/DocumentsController/Documents.js";
import { serverError } from "../Responses/index.js";
import multer from "multer";

const routes = express.Router();
const documents = new DocumentDetails();

// Configure multer storage if needed
const upload = multer();

// Done
routes.post(
  "/upload-documents",
  upload.fields([
    {
      name: "aadharFront",
      maxCount: 1,
    },
    {
      name: "aadharBack",
      maxCount: 1,
    },
    {
      name: "panFile",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "sign",
      maxCount: 1,
    },
    {
      name: "matriculation",
      maxCount: 1,
    },
    {
      name: "intermediate",
      maxCount: 1,
    },
    {
      name: "graduation",
      maxCount: 1,
    },
    {
      name: "postGraduation",
      maxCount: 1,
    },
    {
      name: "other",
      maxCount: 1,
    },
    {
      name: "additional",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      const userId = req.body?.userId;

      // Add null checks for files
      const aadharFront = req.files?.aadharFront?.[0];
      const aadharBack = req.files?.aadharBack?.[0];
      const panFile = req.files?.panFile?.[0];
      const image = req.files?.image?.[0];
      const sign = req.files?.sign?.[0];
      const matriculation = req.files?.matriculation?.[0];
      const intermediate = req.files?.intermediate?.[0];
      const graduation = req.files?.graduation?.[0];
      const postGraduation = req.files?.postGraduation?.[0];
      const other = req.files?.other?.[0];
      const additional = req.files?.additional?.[0];
      // Validate required files

      const missingFields = [];

      if (!aadharFront) missingFields.push("aadharFront");
      if (!aadharBack) missingFields.push("aadharBack");
      if (!sign) missingFields.push("sign");
      if (!image) missingFields.push("image");
      if (!userId) missingFields.push("userId");

      if (missingFields.length > 0) {
        return res.status(400).json({
          status: 400,
          message: "Missing required files",
          missingFields: missingFields,
        });
      }

      const result = await documents.uploadDocument(
        aadharFront,
        aadharBack,
        panFile,
        sign,
        image,
        userId,
        matriculation,
        intermediate,
        graduation,
        postGraduation,
        other,
        additional
      );
      return res.status(result.status).send(result);
    } catch (err) {
      console.log(err);
      return res.status(serverError.status).send(serverError);
    }
  }
);

// done
routes.patch(
  "/update-documents",
  upload.fields([
    {
      name: "aadharFront",
      maxCount: 1,
    },
    {
      name: "aadharBack",
      maxCount: 1,
    },
    {
      name: "panFile",
      maxCount: 1,
    },
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "sign",
      maxCount: 1,
    },
    {
      name: "matriculation",
      maxCount: 1,
    },
    {
      name: "intermediate",
      maxCount: 1,
    },
    {
      name: "graduation",
      maxCount: 1,
    },
    {
      name: "graduation",
      maxCount: 1,
    },
    {
      name: "postGraduation",
      maxCount: 1,
    },
    {
      name: "other",
      maxCount: 1,
    },
    {
      name: "additional",
      maxCount: 1,
    },
  ]),
  async (req, res) => {
    try {
      // Destructure userId from the body
      const userId = req.body?.userId;
      const aadharFront = req.files?.aadharFront?.[0];
      const aadharBack = req.files?.aadharBack?.[0];
      const panFile = req.files?.panFile?.[0];
      const image = req.files?.image?.[0];
      const sign = req.files?.sign?.[0];
      const matriculation = req.files?.matriculation?.[0];
      const intermediate = req.files?.intermediate?.[0];
      const graduation = req.files?.graduation?.[0];
      const postGraduation = req.files?.postGraduation?.[0];
      const other = req.files?.other?.[0];
      const additional = req.files?.additional?.[0];
      // Validate if the user has permission to update this document
      // if (req.user.id !== userId && req.user.role !== "admin") {
      //   return res.status(403).json({
      //     success: false,
      //     message: "You don't have permission to update this document",
      //   });
      // }

      const result = await documents.updateDocumentById({
        userId,
        aadharFront,
        aadharBack,
        panFile,
        image,
        sign,
        matriculation,
        intermediate,
        graduation,
        postGraduation,
        other,
        additional,
      });

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error("Error in update document route:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
      });
    }
  }
);

// Done
routes.get("/get-documents/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const val = await documents.getDocumentById(id);
    res.status(val.status).send(val);
  } catch (err) {
    res.status(serverError.status).send(serverError);
  }
});

routes.get("/get-all-documents", async (req, res) => {
  try {
    const { page, limit = 10 } = req.query;
    const val = await documents.getAllDocuments(page, limit);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});
export default routes;
