import TeleSignSDK from "telesignsdk";

const customerId = process.env.CUSTOMER_ID;
const apiKey = process.env.TELE_API_KEY;

const telesign = new TeleSignSDK(customerId, apiKey);

export const sendSms = async (phoneNumber, message, messageType) => {
    telesign.sms.message((err, reply) => {
        if (err) {
            console.log(err);
            return false;
        }
        else {
            console.log(reply)
            return true;
        }
    }, phoneNumber, message, messageType)
};