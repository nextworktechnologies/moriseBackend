import collections from "../../Collections/collections.js";
import {
  columnUpdated,
  fetched,
  InvalidId,
  serverError,
  tryAgain,
} from "../../Responses/index.js";
import queryModel from "../../Models/queryModel.js";
import { ObjectId } from "mongodb";

const query = new queryModel();
const collection = collections;

class QueryController {
  constructor() {}

  async createQuery(body) {
    const add = query.fromJson(body);
    try {
      const result = await collection
        .queryCollection()
        .insertOne(add.toDatabaseJson(body));
      if (result && result.insertedId) {
        return {
          ...columnUpdated("Query"),
          data: add.toClientJson(body),
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

  async getQuery(page, limit) {
    const skip = parseInt(page) * limit;
    try {
      const result = await collection
        .queryCollection()
        .find({})
        .skip(skip)
        .limit(limit)
        .toArray();

      if (result.length > 0) {
        let data = [];
        result.map((e) => {
          data.push(query.fromJson(e));
        });
        return {
          ...fetched("Query"),
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
  async getQueryByUserId(id) {
    try {
      const result = await collection
        .queryCollection()
        .find({ userId: id })
        .toArray();
      if (result && result.insertedId) {
        let data = [];
        result.map((e) => {
          data.push(query.fromJson(e));
        });
        return {
          ...fetched("Query"),
          data: data,
        };
      } else {
        return tryAgain;
      }
    } catch (error) {
      return {
        ...serverError,
        error,
      };
    }
  }
  async updateQuery(body) {
    try {
      const { id, status } = body;

      if (!id || !status) {
        return {
          status: 400,
          message: "Query ID and status are required",
        };
      }

      const result = await collection.queryCollection().updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } } 
      );

      if (result.matchedCount === 0) {
        return {
          status: 404,
          message: "Query not found",
        };
      }

      return {
        status: 200,
        message: "Query updated successfully",
        data: result,
      };
    } catch (error) {
      return {
        status: 500,
        message: "An error occurred while updating the query",
        error,
      };
    }
  }
}

export default QueryController;
