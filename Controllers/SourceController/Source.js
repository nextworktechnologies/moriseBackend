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
  import sourceModel from "../../Models/sourceModel.js";
  import collections from "../../Collections/collections.js";
  
  const source = new sourceModel();
  
  // Collections
  
  const collection = collections;
  
  
  class  Source {
  
    constructor() { }
  
    async getSource(page, limit) {
      const skip = parseInt(page) * limit;
      try {
        const result = await collection.sourceCollection().find({}).skip(skip).limit(limit).toArray();
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
  
    async  createSource(body) {
        
      const sources = source.fromJson(body);
      try {
        const result = await collection.sourceCollection().insertOne(sources.toDatabaseJson());
        console.log("result",result)
        if (result ) {
          return {
            ...columnCreated("Source"),
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
  
    async getSourceById(id) {
      try {
        const result = await collection.sourceCollection().findOne({
          _id: new ObjectId(id),
        });
        if (result) {
         
          return {
            ...fetched("Source"),
            data: result
          };
        } else {
          return InvalidId("Source");
        }
      } catch (err) {
        return {
          ...serverError,
          err
        };
      }
    }
  
    async  updateSource(body) {
       
      try {
        const {
          id
        } = body;
        const objectId = new ObjectId(id)
        const sources = source.toUpdateJson(body);
        console.log("dd",sources)
        const result = await collection.sourceCollection().updateOne({
          _id: objectId
        }, {
          $set: {
            ...sources,
          },
          
        });

        console.log("dd",result)
        if (result.modifiedCount > 0) {
          return {
            ...columnUpdated("Source"),
            data: result
          };
        } else {
          return InvalidId("Source");
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
  
    async deleteSourceById(id) {
      
        const objectId = new ObjectId(id)
      try {
        const result = await collection.sourceCollection().deleteOne({
          _id: objectId,
        });
        console.log("result",result)
        if (result.deletedCount > 0) {        
          return {
            ...adddelete("Source")
          };
        } else {
          return InvalidId("Source");
        }
      } catch (err) {
        console.error("Error:", err);
        return {
          ...serverError,
          err
        };
      }
    }


    async getSource(page, limit) {
        console.log(page, limit)
        const skip = parseInt(page-1) * limit;
        try {
          const result = await collection.sourceCollection().find({}).skip(skip).limit(parseInt(limit)).toArray();
      
          if (result.length > 0) {
       
        
            return {
              ...fetched("Source"),
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
  
  export default  Source;