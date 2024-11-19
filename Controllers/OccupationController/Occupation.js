import collections from "../../Collections/collections.js";
import {
  columnUpdated,
  fetched,
  InvalidId,
  serverError,
  tryAgain,
} from "../../Responses/index.js";
import occupationModel from "../../Models/occupationModel.js";
import { ObjectId } from "mongodb";

const occupation = new occupationModel();
const collection = collections;

class OccupationController {
  constructor() {}
  async getOccupation(page, limit) {
    const skip = parseInt(page) * limit;
    try {
      const result = await collection
        .occupationCollection()
        .find({})
        .skip(skip)
        .limit(limit)
        .toArray();
      if (result.length > 0) {
        let data = [];
        result.map((e) => {
          data.push(occupation.fromJson(e));
        });
        return {
          ...fetched("Occupation"),
          data: data,
        };
      } else {
        return tryAgain;
      }
    } catch (err) {
      return {
        ...serverError,
        err,
      };
    }
  }
  async createOccupation(body) {
    const add = occupation.fromJson(body);
    try {
      // Check if occupation with the same ID already exists
      const existingOccupation = await collection
        .occupationCollection()
        .findOne({ id: add.id });

      if (existingOccupation) {
        return {
          status: "error",
          message: "Occupation with this ID already exists.",
        };
      }

      const result = await collection
        .occupationCollection()
        .insertOne(add.toDatabaseJson(body));
      console.log("result", result);

      if (result && result.insertedId) {
        return {
          ...columnUpdated("Occupation"),
          data: {
            id: add.id,
            occupation: add.occupation,
            type: add.type,
            status: add.status,
            createdAt: add.createdAt,
            updatedAt: add.updatedAt,
          },
        };
      } else {
        return tryAgain;
      }
    } catch (error) {
      console.error("Error:", error);
      return serverError;
    }
  }

  async updateOccupation(body) {
    const update = occupation.fromJson(body);
    try {
      const result = await collection
        .occupationCollection()
        .updateOne({ id: update.id }, { $set: update.toUpdateJson() });
      if (result && result.modifiedCount > 0) {
        return {
          ...columnUpdated("Occupation"),
          data: {
            id: update.id,
            occupation: update.occupation,
            type: update.type,
            status: update.status,
            updatedAt: update.updatedAt,
          },
        };
      } else {
        return tryAgain;
      }
    } catch (error) {
      return serverError;
    }
  }
  async deleteOccupationById(id) {
    try {
      // Validate if id is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        console.log("Invalid ObjectId format:", id);
        return {
          status: 400,
          type: "invalid",
          message: "Invalid Occupation ID format",
        };
      }

      const uid = new ObjectId(id);
      console.log("Input ID:", id);
      console.log("Converted ObjectId:", uid);

      // Log the query we're about to execute
      console.log("Executing query:", { _id: uid });

      const result = await collection.occupationCollection().deleteOne({
        _id: uid,
      });

      console.log("Delete operation result:", result);

      if (result.deletedCount > 0) {
        return {
          status: 200,
          message: "Occupation Deleted Successfully",
        };
      }

      // If no document was found
      console.log("No document found with ID:", id);
      return {
        status: 404,
        type: "not_found",
        message: "Occupation not found",
      };
    } catch (err) {
      console.error("Detailed error:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
      });
      return {
        status: 500,
        type: "server_error",
        message: "Internal Server Error",
        error: err.message,
      };
    }
  }
}

export default OccupationController;
