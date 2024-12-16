import crypto from "crypto";

export const decryptData = (encryptedData) => {
  const decipher = crypto.createDecipher(
    "aes-128-cbc",
    process.env.WORKING_KEY
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};



// Encryption function using AES in CBC mode
export function encryptDatapayment(data, workingKey) {
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");

    const key = Buffer.from(crypto.createHash('md5').update(workingKey).digest(), 'base64');
    const iv = Buffer.from(ivBase64, 'base64');

    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encryptedData = cipher.update(data, 'utf8', 'base64');
    encryptedData += cipher.final('base64');

    return encryptedData;
}

   
export function encryptData(data,key) {
  const cipher = crypto.createCipheriv(
    "aes-128-cbc",
   key,
    Buffer.alloc(16, 0)
  ); // CBC mode with 128-bit key
  let encrypted = cipher.update(data, "utf-8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}


