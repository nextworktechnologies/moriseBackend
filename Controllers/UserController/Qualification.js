import {
    ObjectId
  } from "mongodb";
  import {
    columnUpdated,
    columnCreated,
    InvalidId,
    fetched,
    serverError,
    tryAgain,
    notExist,
    adddelete
  } from "../../Responses/index.js";
  import qualificationModel from "../../Models/qualificationModel.js";
  import collections from "../../Collections/collections.js";
  
  const qualification = new qualificationModel();
  
  // Collections
  
  const collection = collections;
  
  
  class  Qualification {
  
    constructor() { }
  
    async getCategory(page, limit) {
      const skip = parseInt(page) * limit;
      try {
        const result = await collection.categoryCollection().find({}).skip(skip).limit(limit).toArray();
        if (result.length > 0) {
          let data = [];
          result.map((e) => {
            data.push(category.fromJson(e));
          });
          return {
            ...fetched("Ccategory"),
            data: data
          };
        } else {
          return tryAgain;
        }
      } catch (err) {
        return {
          ...serverError,
          err
        };
      }
    }
  
    async  createQualification(body) {
        
      const Qualification = qualification.fromJson(body);
      try {
        const result = await collection.qualificationCollection().insertOne(Qualification.toDatabaseJson());
        console.log("result",result)
        if (result ) {
          return {
            ...columnCreated("Qualification"),
            data: {
              id: result.insertedId,
              data: result
            }
          };
        } else {
          return tryAgain;
        }
      } catch (error) {
        cconsole.log(error)
        return serverError;
      }
    }
  
    async getAddressByUserId(id) {
       
      try {
        const result = await collection.categoryCollection()
          .find({
            userId: id,
          })
          .toArray();
        if (result.length > 0) {
          return {
            ...fetched("Address"),
            data: result
          };
        } else {
          return InvalidId("User");
        }
      } catch (err) {
        console.log(err)
        return {
          ...serverError,
          err
        };
      }
    }
  
    async getQualificationById(id) {
      try {
        const result = await collection.qualificationCollection().findOne({
          _id: new ObjectId(id),
        });
        if (result) {
         
          return {
            ...fetched("Qualification"),
            data: result
          };
        } else {
          return InvalidId("Qualification");
        }
      } catch (err) {
        return {
          ...serverError,
          err
        };
      }
    }
  
    async  updateQualification(body) {
       
      try {
        const {
          id
        } = body;
        const objectId = new ObjectId(id)
        const qualifications = qualification.toUpdateJson(body);
        console.log("dd",qualifications)
        const result = await collection.qualificationCollection().updateOne({
          _id: objectId
        }, {
          $set: {
            ...qualifications,
          },
          
        });

        console.log("dd",result)
        if (result.modifiedCount > 0) {
          return {
            ...columnUpdated("qualification"),
            data: result
          };
        } else {
          return InvalidId("qualifications");
        }
      } catch (err) {
        console.log(err)
        return serverError;
      }
    }
  
    async getAddressBycode(code, page, limit) {
      let skip = parseInt(page) * limit;
      try {
        const res = await collection.categoryCollection().find({
          postalCode: code
        }).skip(skip).limit(limit).toArray();
        if (res && res.length > 0) {
          return {
            ...fetched("Address"),
            data: res
          };
        }
        return notExist("Address");
      } catch (err) {
        return {
          ...serverError,
          err
        };
  
      }
    }
  
    async deleteQualificationById(id) {
      
        const objectId = new ObjectId(id)
      try {
        const result = await collection.qualificationCollection().deleteOne({
          _id: objectId,
        });
        console.log("result",result)
        if (result.deletedCount > 0) {        
          return {
            ...adddelete("delete")
          };
        } else {
          return InvalidId("delete");
        }
      } catch (err) {
        console.error("Error:", err);
        return {
          ...serverError,
          err
        };
      }
    }


    async getQualification(page, limit) {
        console.log(page, limit)
        const skip = parseInt(page-1) * limit;
        try {
          const result = await collection.qualificationCollection().find({}).skip(skip).limit(parseInt(limit)).toArray();
      
          if (result.length > 0) {
       
        
            return {
              ...fetched("qualification"),
              data: result
            };
          } else {
            return tryAgain;
          }
        } catch (err) {
          console.log("err",err)
          return {
            ...serverError,
            err
          };
        }
      }
  }
  
  export default  Qualification;