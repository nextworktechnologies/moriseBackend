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
  
    async  createCategory(body) {
        
      const Category = category.fromJson(body);
      try {
        const result = await collection.categoryCollection().insertOne(Category.toDatabaseJson());
        console.log("result",result)
        if (result ) {
          return {
            ...columnCreated("Category"),
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
  
    async getCategoryById(id) {
      try {
        const result = await collection.categoryCollection().findOne({
          _id: new ObjectId(id),
        });
        if (result) {
         
          return {
            ...fetched("Category"),
            data: result
          };
        } else {
          return InvalidId("Category");
        }
      } catch (err) {
        return {
          ...serverError,
          err
        };
      }
    }
  
    async  updateCategory(body) {
       
      try {
        const {
          id
        } = body;
        const objectId = new ObjectId(id)
        const categories = category.toUpdateJson(body);
        console.log("dd",categories)
        const result = await collection.categoryCollection().updateOne({
          _id: objectId
        }, {
          $set: {
            ...categories,
          },
          
        });

        console.log("dd",result)
        if (result.modifiedCount > 0) {
          return {
            ...columnUpdated("category"),
            data: result
          };
        } else {
          return InvalidId("Category");
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
  
    async deleteCategoryById(id) {
      
        const objectId = new ObjectId(id)
      try {
        const result = await collection.categoryCollection().deleteOne({
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


    async getAllCategory(page, limit) {
        console.log(page, limit)
        const skip = parseInt(page-1) * limit;
        try {
          const result = await collection.categoryCollection().find({}).skip(skip).limit(parseInt(limit)).toArray();
      
          if (result.length > 0) {
       
        
            return {
              ...fetched("category"),
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
  
  export default Category;