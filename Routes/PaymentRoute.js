import express from "express";
import PaymentHistory from "../Controllers//CCavenue/Payment.js";

import { serverError } from "../Responses/index.js";

const routes = express.Router();
const paymentHistory = new PaymentHistory();

routes.post("/create-payment-history", async (req, res) => {
  try {
    const val = await paymentHistory.createPaymentHistory(req.body);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

routes.post("/payment", async (req, res) => {
  try {
    const val = await paymentHistory.initiatePayment(req.body);
    console.log("val",val)
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

routes.post("/payment/response", async (req, res) => {
  try {
    const val = await paymentHistory.handleResponse(req.body);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

routes.get("/payment/cancel", async (req, res) => {
  try {
    const val = await paymentHistory.handleCancellationnp();
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

routes.post("/create-payment-history", async (req, res) => {
  try {
    const val = await paymentHistory.createPaymentHistory(req.body);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

routes.get("/get-payment-history", async (req, res) => {
  try {
    const val = await paymentHistory.getPaymentHistory();
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

routes.get("/get-payment-history-by-id/:id", async (req, res) => {
  try {
    const val = await paymentHistory.getPaymentHistoryById(req.params.id);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

routes.delete("/delete-payment-history/:id", async (req, res) => {
  try {
    const val = await paymentHistory.deletePaymentHistory(req.params.id);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});
export default routes;
