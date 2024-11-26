import collections from "../../Collections/collections.js";
import {
  columnUpdated,
  fetched,
  InvalidId,
  serverError,
  tryAgain,
} from "../../Responses/index.js";
import mediaModel from "../../Models/mediaModel.js";
import { ObjectId } from "mongodb";

const media = new mediaModel();
const collection = collections;

class MediaController {
  constructor() {}
  async createMedia(body) {
   
   let category=new ObjectId(body.category)
    
   body.category=category 
   console.log(body.category)

    const add = media.fromJson(body);
    try {
      const result = await collection
        .mediaCollection()
        .insertOne(add.toDatabaseJson(body));
      if (result && result.insertedId) {
        return {
          ...columnUpdated("Media"),
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

  async getMedia(page, limit) {
    const skip = parseInt(page) * limit;
    try {
      // const result = await collection
      //   .mediaCollection()
      //   .find({})
      //   .skip(skip)
      //   .limit(limit)
      //   .toArray();

        const result = await collection.mediaCollection().aggregate([{
            $lookup: {
      from: "categoy",           // The name of the collection you're joining with
      localField: "category",     // The field in the mediaCollection that stores the category ID
      foreignField: "_id",        // The field in the category collection that matches the category ID
      as: "categoryData"          // The alias where the category data will be stored
    }
        }]).skip(skip).limit(limit).toArray();

      if (result.length > 0) {
        let data = [];
        result.map((e) => {
          data.push(media.fromJson(e));
        });
        return {
          ...fetched("Media"),
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

  async getMediaById(id) {
    try {
      const result = await collection
        .mediaCollection()
        .findOne({ _id: new ObjectId(id) });

      if (result && result._id) {
        return {
          ...fetched("Media"),
          data: result,
        };
      } else {
        return {
          ...InvalidId,
          error: "No media found",
        };
      }
    } catch (err) {
      return {
        ...serverError,
        err,
      };
    }
  }

  async updateMedia(req) {
    const { id } = req.params;
    const update = media.fromJson(req.body);
    console.log(update, "update");
    
    try {
      const result = await collection
        .mediaCollection()
        .updateOne({ _id: new ObjectId(id) }, { $set: req.body });
      if (result && result.modifiedCount > 0) {
        return {
          ...columnUpdated("Media"),
          data: result,
        };
      } else {
        return tryAgain;
      }
    } catch (error) {
      return serverError;
    }
  }
}

export default MediaController;
