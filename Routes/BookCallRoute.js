import express from "express";
import BookCallController from "../Controllers/BookCall/BookCall.js";
import { serverError } from "../Responses/index.js";

const routes = express.Router();

const bookCall = new BookCallController();

// create a book call
routes.post("/create-book-call", async (req, res) => {
  try {
    const val = await bookCall.createCall(req.body);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

// get booked calls by user
routes.get("/get-booked-calls/:userId", async (req, res) => {
  try {
    const val = await bookCall.getBookedCallsByUser(req.params.userId);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

// get all booked calls
routes.get("/get-all-booked-calls", async (req, res) => {
  try {
    const val = await bookCall.getAllBookedCalls();
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

// update a booked call by userId
routes.put("/update-booked-call/:userId", async (req, res) => {
  try {
    const val = await bookCall.updateBookedCallByUserId(
      req.params.userId,
      req.body
    );
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

// delete a booked call by userId
routes.delete("/delete-booked-call/:userId", async (req, res) => {
  console.log("delete", req);

  try {
    const val = await bookCall.deleteBookedCallByUserId(req.params.userId);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

export default routes;
