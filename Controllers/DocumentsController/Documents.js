import { ObjectId } from "mongodb";
import fs, { Dir } from "fs";

import {
  columnUpdated,
  InvalidId,
  fetched,
  serverError,
  tryAgain,
  deleted,
  noAddress,
  kycDone,
  notExist,
  kycExist,
  accountCreated,
  subAccCreated,
  kycRejected,
  unauthorized,
  kycRequired,
} from "../../Responses/index.js";

import documentModel from "../../Models/documentModel.js";
import collections from "../../Collections/collections.js";
