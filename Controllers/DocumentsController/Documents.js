import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  fetched,
  serverError,
  notExist,
  kycDone,
  columnUpdated,
} from "../../Responses/index.js";
import documentModel from "../../Models/documentModel.js";
import collections from "../../Collections/collections.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const document = new documentModel();

class DocumentDetails {
  async getDocumentDetail(page, limit) {
    try {
      let skip = parseInt(page) * limit;
      const result = await collections
        .documentCollection()
        .find({})
        .skip(skip)
        .limit(limit)
        .toArray();

      if (result.length > 0) {
        return {
          ...fetched("Document Details"),
          data: result,
        };
      }
      return notExist("Document Details");
    } catch (err) {
      console.error("Error in getDocumentDetail:", err);
      return notExist("Document Details");
    }
  }

  async uploadDocument(
    aadharFront,
    aadharBack,
    panFile,
    sign,
    image,
    userId,
    matriculationCertificate,
    intermediateCertificate,
    graduationCertificate,
    postGraduationCertificate,
    other,
    additional
  ) {
    try {
      // Create user folder
      console.log("dirname", __dirname);
      const userFolder = path.join(__dirname, "../../", "uploads", userId);
      console.log("userFolder", userFolder);

      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }

      // Helper function to save file
      const saveFile = (file, folder) => {
        if (!file) return null;
        const filePath = path.join(folder, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
        return filePath;
      };

      // Save all files
      const savedFiles = {
        aadharFront: saveFile(aadharFront, userFolder),
        aadharBack: saveFile(aadharBack, userFolder),
        panFile: saveFile(panFile, userFolder),
        sign: saveFile(sign, userFolder),
        image: image ? saveFile(image, userFolder) : null,
        matriculation: matriculationCertificate
          ? saveFile(matriculationCertificate, userFolder)
          : null,
        intermediate: intermediateCertificate
          ? saveFile(intermediateCertificate, userFolder)
          : null,
        graduation: graduationCertificate
          ? saveFile(graduationCertificate, userFolder)
          : null,
        postGraduation: postGraduationCertificate
          ? saveFile(postGraduationCertificate, userFolder)
          : null,
        other: other ? saveFile(other, userFolder) : null,
        additional: additional ? saveFile(additional, userFolder) : null,
      };

      // Save document details to database if needed
      const documentData = {
        userId,
        files: savedFiles,
        uploadedAt: new Date(),
        status: "pending", 
      };

      // Add to database if you have a collection
      await collections.documentCollection().insertOne(documentData);

      return {
        status: 200,
        message: "Documents uploaded successfully",
        data: savedFiles,
      };
    } catch (error) {
      console.error("Error in uploadDocument:", error);
      return {
        status: 500,
        message: "Error uploading documents",
        error: error.message,
      };
    }
  }
  async updateDocumentById(body) {
    try {
      const { userId, ...files } = body;

      if (!userId) {
        return {
          success: false,
          message: "User ID is required",
        };
      }

      // Create/ensure user folder exists
      const userFolder = path.join(__dirname, "../../", "uploads", userId);
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }

      // Helper function to save file
      const saveFile = (file, folder) => {
        if (!file) return null;
        const filePath = path.join(folder, file.originalname);
        fs.writeFileSync(filePath, file.buffer);
        return filePath;
      };

      // Process and save new files
      const updatedFiles = {};

      // List of possible file fields
      const fileFields = [
        "aadharFront",
        "aadharBack",
        "panFile",
        "sign",
        "image",
        "matriculationCertificate",
        "intermediateCertificate",
        "graduationCertificate",
        "postGraduationCertificate",
        "other",
        "additional",
      ];

      // Save only the files that are provided in the update
      fileFields.forEach((field) => {
        if (files[field]) {
          updatedFiles[field] = saveFile(files[field], userFolder);
        }
      });

      // Get existing document to preserve non-updated files
      const existingDoc = await collections
        .documentCollection()
        .findOne({ userId });

      // Merge existing files with updated files
      const mergedFiles = {
        ...(existingDoc?.files || {}),
        ...updatedFiles,
      };

      // Prepare update data
      const documentData = {
        ...document.toUpdateJson(body),
        files: mergedFiles,
        updatedAt: new Date(),
      };

      // Update document in database
      const result = await collections
        .documentCollection()
        .updateOne({ userId }, { $set: documentData });

      if (result.modifiedCount > 0) {
        return {
          success: true,
          message: "Document updated successfully",
          files: mergedFiles,
        };
      } else {
        return {
          success: false,
          message: "No document found or no changes made",
        };
      }
    } catch (err) {
      console.error("Error updating document:", err);
      return {
        success: false,
        message: "Error updating document",
        error: err.message,
      };
    }
  }
}

export default DocumentDetails;
