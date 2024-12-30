import collections from "../../Collections/collections.js";
import {
  columnUpdated,
  fetched,
  serverError,
  tryAgain,

} from "../../Responses/index.js";
import PaymentHistoryModel from "../../Models/PaymentHistoryModel.js";
import { ObjectId } from "mongodb";
import {encrypt} from "../../Middlewares/Util/ccavutil.js"
import {
  decryptData,
  encryptDatapayment,
} from "../../Middlewares/CryptoEncrypt/index.js";
import crypto from "crypto";
import { razorpay } from "../../Middlewares/Razorpay/index.js";

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

  //payment initiate
  async   initiatePayment(body) {
    try {
      const { amount, currency } = body; // Amount received from frontend
      const orderId = `order_${Date.now()}`;
      const invoiceNo = await this.generateInvoiceNumber();

       const order = await razorpay.orders.create({
         amount: amount * 100, // Amount in paisa
         currency,
       });
      

      // Create a new order
      // const add = payment.fromJson(body);
      // const result = await collection
      //   .paymentCollection()
      //   .insertOne(add.toDatabaseJson(invoiceNo));
      // //   const order = new Order(orderId, amount);
      // //   Order.save(order); // Simulating order saving

      // // Payment data to be sent to CCAvenue
      // const paymentData = {
      //   merchant_id: process.env.MID,
      //   access_code: process.env.ACCESS_CODE,
      //   working_key: process.env.WORKING_KEY,
      //   order_id: orderId,
      //   amount: amount,
      //   currency: "INR",
      //   //return_url: "https://api.trymorise.com/api/v1/payment/response",
      //   cancel_url: "https://api.trymorise.com/api/v1/payment/cancel",
      // };

      // //Generate Md5 hash for the key and then convert in base64 string
      // var md5 = crypto
      //   .createHash("md5")
      //   .update(process.env.WORKING_KEY)
      //   .digest();
      // var keyBase64 = Buffer.from(md5).toString("base64");

      // //Initializing Vector and then convert in base64 string
      // var ivBase64 = Buffer.from([
      //   0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
      //   0x0c, 0x0d, 0x0e, 0x0f,
      // ]).toString("base64");
      // let payment_string = `merchant_id=${process.env.MID}&order_id=${orderId}&currency=INR&amount=${amount}.00&redirect_url=${paymentData.return_url}&cancel_url=${paymentData.cancel_url}&language=EN`;
      // var encRequest = encrypt(payment_string, keyBase64, ivBase64);
      //   const paymentUrl = `https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction&merchant_id=${paymentData.merchant_id}&encRequest=${encRequest}&access_code=${paymentData.access_code}`;

       

      // console.log(" encryptedRequest", encRequest);

      // // Encrypt the payment data before sending it to CCAvenue
      // console.log("payment_string", payment_string);
      // const encryptedPaymentData = encryptDatapayment(
      //   payment_string,
      //   process.env.WORKING_KEY
      // );
      // console.log("Encrypted Payment Data: ", encryptedPaymentData);

      // Respond with payment form data (to be submitted to CCAvenue)
      if (order) {
        return {
          ...fetched("Address"),
          data: {
           
            data: order,
            // data: paymentData,
            // token: encRequest, // Send the encrypted payment data
            // paymentUrl,
          },
        };
      }
      return notExist("Address");
      // Respond with payment form data (to be submitted to CCAvenue)
      res.status(200).json(paymentData, result);
    } catch (error) {
      console.log("error", error);
    }
  }

  //handle payment response

  async handleResponse(body) {
   
    try {
      console.log("body",body)
          const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            user_id,
            order_id,
            amount 
          } = body;
            
  const invoiceNo = await this.generateInvoiceNumber();
   const add = payment.fromJson({
     userId: user_id,
     amount,
     //  type,
     transactionId: order_id,
     status: true,
     invoice: invoiceNo,
     //  verification,
   });

 
          const generated_signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");
          
            console.log("generated_signature", generated_signature);
          if (generated_signature === razorpay_signature) {
           // res.status(200).json({ success: true });
              const result = await collection
                .paymentCollection()
                .insertOne(add.toDatabaseJson(invoiceNo));
  console.log("resultbhj",result)
              if(result){
                return {
                ...fetched("Payment"),
                data: {
                  success: true,
                  result: result,
                },
              };
              }
              
            }else {
           return notExist("payment failed");
          }
          
    } catch (error) {
      console.log("error",error)
    }
  }
  // Handle payment cancellation

  async handleCancellation(body) {
    try {
     res.json({ status: "cancelled" });
    } catch (error) {
      console.log("error", error);
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
