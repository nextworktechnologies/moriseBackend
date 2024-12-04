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