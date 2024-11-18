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
  import categoryModel from "../../Models/categoryModel.js";
  import collections from "../../Collections/collections.js";
  
  const category = new categoryModel();
  
  // Collections
  
  const collection = collections;
  
  
  class Category {
  
    constructor() { }
  
    async getAddress(page, limit) {
      const skip = parseInt(page) * limit;
      try {
        const result = await collection.addressCollection().find({}).skip(skip).limit(limit).toArray();
        if (result.length > 0) {
          let data = [];
          result.map((e) => {
            data.push(address.fromJson(e));
          });
          return {
            ...fetched("Address"),
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
  
    async  createAddress(body) {
        
      const Address = address.fromJson(body);
      try {
        const result = await collection.addressCollection().insertOne(Address.toDatabaseJson());
        console.log("result",result)
        if (result ) {
          return {
            ...columnCreated("Address"),
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
        const result = await collection.addressCollection()
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
  
    async getAddressById(id) {
      try {
        const result = await collection.addressCollection().findOne({
          _id: new ObjectId(id),
        });
        if (result) {
          let data = new AddressModel().fromJson(result);
          return {
            ...fetched("Address"),
            data: data
          };
        } else {
          return InvalidId("Address");
        }
      } catch (err) {
        return {
          ...serverError,
          err
        };
      }
    }
  
    async  updateAddress(body) {
      try {
        const {
          id
        } = body;
        const add = address.toUpdateJson(body);
      
        const result = await collection.addressCollection().updateOne({
          userId: id.toLowerCase()
        }, {
          $set: {
            ...add,
          },
          
        });
        if (result.modifiedCount > 0) {
          return {
            ...columnUpdated("Address"),
            data: result
          };
        } else {
          return InvalidId("Address");
        }
      } catch (err) {
        return serverError;
      }
    }
  
    async getAddressBycode(code, page, limit) {
      let skip = parseInt(page) * limit;
      try {
        const res = await collection.addressCollection.find({
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
  
    async deleteAddressById(id) {
        console.log("id",id)
      try {
        const result = await collection.addressCollection().deleteOne({
          userId: id,
        });
        console.log("result",result)
        if (result.deletedCount > 0) {        
          return {
            ...adddelete("address")
          };
        } else {
          return InvalidId("Address");
        }
      } catch (err) {
        console.error("Error:", err);
        return {
          ...serverError,
          err
        };
      }
    }
  }
  
  export default Address;