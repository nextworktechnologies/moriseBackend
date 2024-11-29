import { ObjectId } from "mongodb";
import {
  columnUpdated,
  columnCreated,
  InvalidId,
  fetched,
  serverError,
  tryAgain,
  notExist,
  adddelete,
} from "../../Responses/index.js";
import TestimonialsModel from "../../Models/testimonialModel.js";
import collections from "../../Collections/collections.js";

const testimonials = new TestimonialsModel();

// Collections

const collection = collections;

class Testimonial {
  constructor() {}

  async getTestimonial(page, limit) {
    console.log("page", page, "limit", limit);

    const skip = parseInt(page) * limit;    
    try {
      const result = await collection
        .testimonialsCollection()
        .find({})
        .skip(skip)
        .limit(limit)
        .toArray();

      if (result.length > 0) {
        let data = [];
        result.map((e) => {
          data.push(testimonials.fromJson(e));
        });
        return {
          ...fetched("Testimonials"),
          data: data,
        };
      } else {
        return tryAgain;
      }
    } catch (err) {
      console.log("err in controle", err);

      return {
        ...serverError,
        err,
      };
    }
  }

  async createTestimonial(body) {
    let id = new ObjectId(body.userId);

    const Testimonials = testimonials.fromJson(body);
    try {
      const result = await collection
        .testimonialsCollection()
        .insertOne(Testimonials.toDatabaseJson());
      console.log("result", result);
      if (result) {
        return {
          ...columnCreated("Testimonials"),
          data: {
            id: result.insertedId,
            data: result,
          },
        };
      } else {
        return tryAgain;
      }
    } catch (error) {
      cconsole.log(error);
      return serverError;
    }
  }

  async getTestimonialByUserId(id) {
    let Id = new ObjectId(id);
    try {
      const result = await collection.testimonialsCollection().findOne({
        _id: Id,
      });

      if (result) {
        return {
          ...fetched("Testimonial"),
          data: result,
        };
      } else {
        return InvalidId("User");
      }
    } catch (err) {
      console.log(err);
      return {
        ...serverError,
        err,
      };
    }
  }

  async getTestimonialById(id) {
    try {
      const result = await collection.testimonialsCollection().findOne({
        _id: new ObjectId(id),
      });
      if (result) {
        let data = new AddressModel().fromJson(result);
        return {
          ...fetched("Address"),
          data: data,
        };
      } else {
        return InvalidId("Address");
      }
    } catch (err) {
      return {
        ...serverError,
        err,
      };
    }
  }

  async updateTestimonial(body) {
    try {
      const { id } = body;
      let Id = new ObjectId(id);
      const testimonial = testimonials.toUpdateJson(body);

      const result = await collection.testimonialsCollection().updateOne(
        {
          _id: Id,
        },
        {
          $set: {
            ...testimonial,
          },
        }
      );
      if (result.modifiedCount > 0) {
        return {
          ...columnUpdated("testimonials"),
          data: result,
        };
      } else {
        return InvalidId("testimonials");
      }
    } catch (err) {
      return serverError;
    }
  }

  async getTestimonialBycode(code, page, limit) {
    let skip = parseInt(page) * limit;
    try {
      const res = await collection
        .testimonialsCollection()
        .find({
          postalCode: code,
        })
        .skip(skip)
        .limit(limit)
        .toArray();
      if (res && res.length > 0) {
        return {
          ...fetched("Address"),
          data: res,
        };
      }
      return notExist("Address");
    } catch (err) {
      return {
        ...serverError,
        err,
      };
    }
  }

  async deleteTestimonialById(id) {
    let Id = new ObjectId(id);
    try {
      const result = await collection.testimonialsCollection().deleteOne({
        _id: Id,
      });
      console.log("result", result);
      if (result.deletedCount > 0) {
        return {
          ...adddelete("testimonial"),
        };
      } else {
        return InvalidId("testimonial");
      }
    } catch (err) {
      console.error("Error:", err);
      return {
        ...serverError,
        err,
      };
    }
  }
}

export default Testimonial;
