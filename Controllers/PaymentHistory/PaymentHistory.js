import collections from "../../Collections/collections.js";
import {
  columnUpdated,
  fetched,
  serverError,
  tryAgain,
} from "../../Responses/index.js";
import PaymentHistoryModel from "../../Models/PaymentHistoryModel.js";
import { ObjectId } from "mongodb";

const payment = new PaymentHistoryModel();
const collection = collections;

// Move generateInvoiceNumber inside the class and make it async
class PaymentHistoryController {
  constructor() {}

  async generateInvoiceNumber() {
    try {
      // Find the last invoice number in the collection
      const lastRecord = await collection
        .paymentCollection()
        .find({})
        .sort({ createAt: -1 })
        .limit(1)
        .toArray();

      if (lastRecord.length > 0 && lastRecord[0].invoice) {
        // Extract the number from the last invoice and increment it
        const lastNumber =
          parseInt(lastRecord[0].invoice.split("-")[1]) || 1000;
        const nextNumber = lastNumber + 1;
        return `INV-${nextNumber}`;
      }
      return "INV-1000";
    } catch (error) {
      console.error("Invoice generation error:", error);
      throw new Error(`Error generating invoice number: ${error.message}`);
    }
  }

  async createPaymentHistory(body) {
    try {
      const invoiceNo = await this.generateInvoiceNumber();
      console.log("invoice no", invoiceNo);

      const add = payment.fromJson(body);

      const result = await collection
        .paymentCollection()
        .insertOne(add.toDatabaseJson(invoiceNo));

      if (result && result.insertedId) {
        return {
          ...columnUpdated("Payment History"),
          data: add.toClientJson(invoiceNo),
        };
      } else {
        return tryAgain;
      }
    } catch (err) {
      return {
        ...serverError,
        error: err.message,
      };
    }
  }

  async getPaymentHistory() {
    try {
      const result = await collection.paymentCollection().find({}).toArray();
      if (result && result.length > 0) {
        return {
          ...fetched("Payment History"),
          data: result,
        };
      } else {
        return {
          ...serverError,
          error: "No payment history found",
        };
      }
    } catch (err) {
      return {
        ...serverError,
        error: err.message,
      };
    }
  }

  async getPaymentHistoryById(id) {
    try {
      const result = await collection
        .paymentCollection()
        .findOne({ _id: new ObjectId(id) });
      if (result && result._id) {
        return {
          ...fetched("Payment History"),
          data: result,
        };
      } else {
        return {
          ...serverError,
          error: "No payment history found",
        };
      }
    } catch (err) {
      return {
        ...serverError,
        error: err.message,
      };
    }
  }

  async deletePaymentHistory(id) {
    try {
      const result = await collection
        .paymentCollection()
        .deleteOne({ _id: new ObjectId(id) });
      if (result && result.deletedCount) {
        return {
          ...columnUpdated("Payment History"),
          data: result,
        };
      } else {
        return {
          ...serverError,
          error: "No payment history found",
        };
      }
    } catch (err) {
      return {
        ...serverError,
        error: err.message,
      };
    }
  }
}

export default PaymentHistoryController;
