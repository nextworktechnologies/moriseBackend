import collections from "../../Collections/collections.js";
import {
  columnUpdated,
  fetched,
  InvalidId,
  serverError,
  tryAgain,
  columnCreated,
} from "../../Responses/index.js";
import callModel from "../../Models/bookCallModel.js";

import { ObjectId } from "mongodb";
const call = new callModel();
const collection = collections;

class BookCallController {
  constructor() {}

  async createCall(body) {
    console.log("create a call", body);

    const add = call.fromJson(body);
    try {
      const result = await collection
        .callCollection()
        .insertOne(add.toDatabaseJson(body));

      if (result && result.insertedId) {
        return {
          ...columnCreated("Call"),
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

  async getBookedCallsByUser(userId) {
    try {
      const result = await collection
        .callCollection()
        .find({ userId })
        .toArray();

      if (result) {
        return {
          ...fetched("Calls"),
          data: result,
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

  async getAllBookedCalls() {
    try {
      const result = await collection.callCollection().find({}).toArray();
      if (result) {
        return {
          ...fetched("Calls"),
          data: result,
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

  async updateBookedCallByUserId(userId, body) {
    console.log("update call", userId, body);

    const add = call.fromJson(body);
    try {
      const result = await collection
        .callCollection()
        .updateOne(
          { userId: ObjectId(userId) },
          { $set: add.toUpdateJson(body) }
        );

      if (result && result.modifiedCount > 0) {
        return {
          ...columnUpdated("Call"),
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

  async deleteBookedCallByUserId(userId) {
    try {
      const result = await collection
        .callCollection()
        .deleteOne({ userId: ObjectId(userId) });

      if (result && result.deletedCount > 0) {
        return {
          ...columnUpdated("Call"),
          data: result,
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
}

export default BookCallController;
