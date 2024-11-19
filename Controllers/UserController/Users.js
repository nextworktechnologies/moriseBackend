import {
    InvalidId,
    deleteUser,
    singleUser,
    accVerifiedSub,
    activateAccount,
    alreadyActive,
    columnUpdated,
    comProfile,
    createAcc,
    debitedSub,
    deleted,
    failedIncome,
    fetched,
    forgetPasswordContent,
    idNotFound,
    income,
    invalidLoginCred,
    invalidOtp,
    limitCrossed,
    loggedIn,
    loginOtp,
    noMember,
    notExist,
    otpSent,
    otpSentSub,
    otpVerified,
    placementer,
    registered,
    serverError,
    tryAgain,
    unauthorized,
    userActivated,
    walletUpdated,
  } from "../../Responses/index.js";
import { ComparePassword,HashPassword,} from "../../Middlewares/EncryptPassword/index.js";  
import { options , sendMail, transponder } from "../../Mailer/index.js";
import UserModel from "../../Models/userModel.js";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path'
import { client } from "../../dbConnection.js";
import collections from "../../Collections/collections.js";
import { ObjectId } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const userModel = new UserModel();
// Collections

const collection = collections;
class User {

 constructor() { }

  // New user registeration controller
  async register(body) {
 
    const User = userModel.fromJson(body);
       const hashedPassword = await HashPassword(User.password);
       User.password = hashedPassword;
    
   // let placementId = body.placementId.toLowerCase();
    try {
        const result = await collection.userCollection().insertOne(User.toDatabaseJson());
       
  
    if (result) {
        return {
          ...registered("User"),
          data: {
            id: result.insertedId.toString(),
       //     userId: result.userId
          }
        };
      } else {
        return tryAgain;
      }
      
    } catch (error) {
       console.log(error)
    }
  }
// update controller
  async update(body) {
    try {
      const {
        id
      } = body;
      const objectId = new ObjectId(id)
 
      const User = userModel.toUpdateJson(body);
     
      const result = await collection.userCollection().updateOne({
        _id:objectId
      }, 
        { $set: User }

      );

    
      if (result.modifiedCount > 0) {
        return {
          ...deleteUser("User"),
          data: {}
        };
      } else {
        return InvalidId("User");
      }
    } catch (err) {
      console.log("dd",err)
      return serverError;
    }
  }

// delete user collection

async deleteUser(id) {
  const objectId = new ObjectId(id)
  try {
    const result = await collection.userCollection().deleteOne({
      _id: objectId,
    });
    if (result.deletedCount > 0) {        
      return {
        ...deleteUser()
      };
    } else {
      return InvalidId("User");
    }
  } catch (err) {
    console.error("Error:", err);
    return {
      ...serverError,
      err
    };
  }
}

//get user by id

async getUserById(id) {
  console.log("id",id)
  const objectId = new ObjectId(id)
  try {
    const result = await collection.userCollection().findOne({
      _id: objectId,
    },{ projection: { password: 0 }} );
   
    if (result) {
    
      return {
        ...singleUser("User"),
        data: result
      };
    } else {
      return InvalidId("Address");
    }
  } catch (err) {
    console.log(err)
    return {
      ...serverError,
      err
    };
  }
}

//get all user data



async getAllUser(page, limit) {
  console.log(limit, page)
  const skip = parseInt(page) * limit;
  try {
    const result = await collection.userCollection().find({}).skip(skip).limit(limit).toArray();
    if (result.length > 0) {
      
      return {
        ...fetched("User"),
        data: result
      };
    } else {
      return tryAgain;
    }
  } catch (err) {
    console.log(err)
    return {
      ...serverError,
      err
    };
  }
}

// login api 
  async login(req,res) {
     const {email,password}=req.body 

        try {
                let value = email.toLowerCase();
                const result = await collections.userCollection().findOne({ $or: [{ phone: value }, { email: value }] });
        
                if ((result && result.phone == value) || (result && result.email == value)){
                    const hashpassword=result.password
                    const Password= await ComparePassword(password,hashpassword)
                        if(Password){
                                const token = jwt.sign(
                                    {
                                    _id: result._id,
                                    },
                                    process.env.JWT_SECRET,
                                    {
                                    expiresIn: "1d",
                                    }
                                );

                          return res
                          .status(loggedIn.status)
                          .cookie("authToken", token, {
                            httpOnly: true,
                            maxAge: 1 * 24 * 60 * 60 * 1000,
                            secure: true, // Set to false for local development
                            sameSite: "strict",
                          })
                          .send({
                            ...loggedIn,
                            data: {
                              token: token,
                              userId: result._id
                            },
                          });
                            }else{
                                let msg = InvalidId("password");
                                return res.status(msg.status).send(msg);
                            }   

                }else{
                    let msg = InvalidId("User");
                    return res.status(msg.status).send(msg);
                }
        
        
            } catch (error) {
                    console.log(error)
                }
        
    
 

    }








}

export default User;