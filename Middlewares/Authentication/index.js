import { ObjectId } from "mongodb";
import {
  InvalidId,
  addressExist,
  authAdmin,
  connectionLimit,
  expired,
  idNotFound,
  invalidPass,
  minLimit,
  mobileLimit,
  notVerified,
  passNotMatched,
  requriedKey,
  serverError,
  signUp,
  tryAgain,
  unauthorized,
  userExists,
  withdrawReported,
} from "../../Responses/index.js";
import jwt from "jsonwebtoken";
import collections from "../../Collections/collections.js";

const collection = collections;

class Auth {
  // is Address Exist
  async addressExist(req, res, next) {
    try {
      const userId = req.body?.userId || req.cookies?.userId;
      if (userId === null) {
        return res.status(idNotFound.status).send(idNotFound);
      }
      let userCount = await collection
        .userCollection()
        .countDocuments({ userId: userId.toLowerCase() });
      if (userCount < 1) {
        return tryAgain;
      }
      const result = await collection.addCollection().countDocuments({
        userId: userId,
      });
      if (result > 0) {
        return res.status(addressExist.status).send(addressExist);
      }
      req.body.userId = userId;
      return next();
    } catch (err) {
      return res.status(serverError.status).send(serverError);
    }
  }

  // UserExist with user Id or not
  isValidUserId = async (req, res, next) => {
    let userId = req.body.userId ?? req.headers?.userid ?? req.headers?.userId;
    try {
      if (userId === null || userId === undefined) {
        return res.status(idNotFound.status).send(idNotFound);
      }
      let value = userId.toLowerCase();
      const result = await collection.userCollection().findOne({
        $or: [{ userId: value }, { email: value }],
      });
      // if (result
      //   // && !result?.isVerified
      // ) {
      //   return res.status(notVerified.status).send(notVerified);
      // }

      if (result && result.userId) {
        req.body.userId = result?.userId;
        req.body.type = result.type;
        return next();
      } else {
        return res.status(idNotFound.status).send(idNotFound);
      }
    } catch (err) {
      console.log(err);
      return res.status(serverError.status).send(serverError);
    }
  };

  // check if client is Admin
  checkAuth = async (req, res, next) => {
    try {
      const userId = req.headers?.userid ?? req.headers?.userId;
      if (userId !== null && userId !== undefined) {
        // Source Admin types to check if user is valid auth
        const source = await collection.srcCollection().findOne({
          type: "admin-types",
        });

        const userTypes = source?.rule ?? "";
        const user = await collection.adminCollection().findOne({
          userId: userId,
        });

        if (userTypes.includes(user?.type) || user?.type === "super-admin") {
          return next();
        } else {
          return res.status(authAdmin.status).send(authAdmin);
        }
      } else {
        return res.status(idNotFound.status).send(idNotFound);
      }
    } catch (err) {
      console.log(err);
      return res.status(serverError.status).send(serverError);
    }
  };

  // Check if user already exists with same email
  userExists = async (req, res, next) => {
    try {
      const { phone } = req.body;
      let email = req.body?.email?.toLowerCase();
      console.log(req.body);
      // Check if user with the same email exists or having account more than 10 with the same number
      const countUser = await collection.userCollection().countDocuments({
        email: email,
      });
      console.log("countUser", countUser);
      if (countUser > 0) {
        return res.status(userExists.status).send({
          ...userExists,
        });
      }
      // Check if more than 10 users with the same mobile number exist
      const countMobile = await collection.userCollection().countDocuments({
        phone: phone,
      });
      if (countMobile > 5) {
        return res.status(mobileLimit.status).send(mobileLimit);
      }
      next();
    } catch (err) {
      console.log("Error: ", err);
      return res.status(serverError.status).send(serverError);
    }
  };

  adminExists = async (req, res, next) => {
    try {
      const { phone } = req.body;
      const email = req.body?.email.toLowerCase();
      // Check if user with the same email exists or having account more than 10 with the same number
      const countUser = await collection.adminCollection().countDocuments({
        email: email,
      });
      if (countUser > 0) {
        return res.status(userExists.status).send({
          ...userExists,
        });
      }
      // Check if more than 10 users with the same mobile number exist
      const countMobile = await collection.adminCollection().countDocuments({
        phone: phone,
      });
      if (countMobile > 10) {
        return res.status(mobileLimit.status).send(mobileLimit);
      }
      return next();
    } catch (err) {
      console.log("Error: ", err);
      return res.status(serverError.status).send(serverError);
    }
  };

  // Check if provided id is valid Object Id
  CheckObjectId = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!ObjectId.isValid(id)) {
        let msg = InvalidId("given");
        return res.status(msg.status).send(msg);
      }
      next();
    } catch (error) {
      return res.status(serverError.status).send({
        ...serverError,
        err,
      });
    }
  };

  // Verify if authorized token is valid
 async verifyToken(req, res, next) {
    console.log("headers", req.headers);

    try {
      const token =
        req.headers?.authorization?.split(" ")[1] || req.cookies?.authToken;
      const userId = req.headers?.userid ?? req.headers?.userId;
      console.log(token, userId);

      if (userId === null || !token || token === undefined) {
        return res.status(signUp.status).send(signUp);
      }

      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        console.log(err, decoded);

        if (err || decoded?._id !== userId) {
          return res.status(expired.status).send(expired);
        }
        return next();
      });
    } catch (err) {
      return res.status(serverError.status).send(serverError);
    }
  }

  
  async verifyUser(req, res, next) {
    try {
      const user = collections
        .userCollection()
        .findOne({ userId: req.body?.userId });
      if (user && user?.isVerified) {
        return next();
      } else {
        return res.status(notVerified.status).send(notVerified);
      }
    } catch (err) {
      return res.status(serverError.status).send(serverError);
    }
  }

  async withdrawAuth(req, res, next) {
    try {
      let { status = null } = req.body;
      const userId = req.headers.userid ?? req.headers.userId;
      if (req.body?.type === "withdraw") {
        let countWithdraw = await collections.transCollection().countDocuments({
          $and: [{ userId: userId }, { status: false }, { type: "withdraw" }],
        });

        if (countWithdraw > 0) {
          return res.status(withdrawReported.status).send(withdrawReported);
        }
      }
      console.log("withdraw 1", req.body);
      if (isNaN(parseFloat(req.body.amount))) {
        return res.status(unauthorized.status).send(unauthorized);
      }
      if (parseFloat(req.body.amount) < 500) {
        return res.status(minLimit.status).send(minLimit);
      }
      if (status === true) {
        return res.status(unauthorized.status).send(unauthorized);
      } else {
        req.body.status = true;
        return next();
      }
    } catch (err) {
      console.log(err);
      return res.status(serverError.status).send(serverError);
    }
  }

  // Check storage limit
  storageLimit = async (req, res, next) => {
    try {
      const connection = await collection
        .connCollection()
        .find({
          userId: req.body?.userId,
        })
        .toArray();
      const user = await collections
        .userCollection()
        .findOne({ userId: req.body?.userId });

      if (connection.length > 0) {
        let condition = connection.find((e) => {
          return e.status === false;
        });
        if (condition && !condition?.status) {
          await collections
            .connCollection()
            .deleteOne({ _id: new ObjectId(condition._id) });
        }

        const source = await collection.srcCollection().findOne({
          type: "connection-limit",
        });
        if (!source || source === null) {
          return res.status(tryAgain.status).send(tryAgain);
        }

        let totalStorage = 0;

        connection.forEach((e) => {
          totalStorage += parseFloat(e.storage) || 0;
        });

        if (
          user &&
          user.type !== "organisation" &&
          (parseFloat(req.body?.storage) > parseInt(source.rule) ||
            totalStorage >= parseInt(source.range))
        ) {
          return res.status(connectionLimit.status).send(connectionLimit);
        }
      }
      return next();
    } catch (err) {
      return res.status(serverError.status).send({
        ...serverError,
        err,
      });
    }
  };

  // check if body contains required fields
  checkFields(fields) {
    return async (req, res, next) => {
      const missingFields = fields.filter((field) => !req.body[field]);
      if (missingFields.length > 0) {
        let msg = requriedKey(missingFields);
        return res.status(msg.status).send(msg);
      }
      next();
    };
  }

  // check if body contains required files
  checkFiles(fields) {
    return async (req, res, next) => {
      console.log(req.files);
      const missingFiles = await fields.filter((file) => !req.files?.[file]);
      if (missingFiles.length > 0) {
        let msg = requriedKey(missingFiles);
        return res.status(msg.status).send(msg);
      }
      next();
    };
  }

  // check password and confirm password
  matchPassworrd = (req, res, next) => {
    if (req.body?.password === req.body?.confirmPassword) {
      return next();
    } else {
      return res.status(passNotMatched.status).send(passNotMatched);
    }
  };

  // Check password pattern
  checkPassword = (req, res, next) => {
    const passwordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (
      !passwordPattern.test(req.body.password) &&
      req.body.password?.length < 8
    ) {
      return res.status(invalidPass.status).send(invalidPass);
    }
    next();
  };
}

export default Auth;
