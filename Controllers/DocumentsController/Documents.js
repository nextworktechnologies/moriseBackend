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
  async getAllDocuments(page, limit) {
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

  async getDocumentById(id) {
    try {
      const result = await collections
        .documentCollection()
        .findOne({ userId: id });
      if (result) {
        return {
          ...fetched("Document"),
          data: result,
        };
      } else {
        return notExist("Document");
      }
    } catch (err) {
      console.error("Error while getting document by id:", err);
      return notExist("Document");
    }
  }

  async uploadDocument(
    aadharFront,
    aadharBack,
    panFile,
    sign,
    passportPhoto,
    userId,
    matriculationCertificate,
    intermediateCertificate,
    graduationCertificate,
    postGraduationCertificate,
    other,
    cv
  ) {
    try {
      const userFolder = path.join(__dirname, "../../", "uploads", userId);
      if (!fs.existsSync(userFolder)) {
        fs.mkdirSync(userFolder, { recursive: true });
      }

      const saveFile = (file, folder) => {
        console.log("file", file);

        if (!file) return null;

        let filePath;

        try {
          // If the file is a base64 string
          if (typeof file === "string" && file.startsWith("data:")) {
            const matches = file.match(
              /^data:([A-Za-z-+\/]+);base64,([A-Za-z0-9+/=]+)$/
            );

            if (matches && matches.length === 3) {
              const fileType = matches[1]; // e.g., image/png
              const base64Data = matches[2];
              const extension = fileType.split("/")[1]; // Extract file extension

              // Generate a filename for the file
              filePath = path.join(folder, `file.${extension}`);
              const buffer = Buffer.from(base64Data, "base64");
              fs.writeFileSync(filePath, buffer);
            } else {
              console.error("Invalid base64 file format");
              return null;
            }
          }
          // If it's a regular file (e.g., from multer)
          else if (file.originalname && file.buffer) {
            filePath = path.join(folder, file.originalname);
            fs.writeFileSync(filePath, file.buffer);
          }
          // Invalid file type
          else {
            console.error("Unsupported file format or structure");
            return null;
          }
        } catch (error) {
          console.error("Error saving file:", error.message);
          return null;
        }

        return filePath;
      };

      // Save all files
      const savedFiles = {
        aadharFront: saveFile(aadharFront, userFolder),
        aadharBack: saveFile(aadharBack, userFolder),
        panFile: saveFile(panFile, userFolder),
        sign: saveFile(sign, userFolder),
        passportPhoto: passportPhoto
          ? saveFile(passportPhoto, userFolder)
          : null,
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
        cv: saveFile(cv, userFolder),
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
