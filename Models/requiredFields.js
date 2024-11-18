export const reqFields = {
  // user fields
  user: [
    "initial",
    "fullName",
    "password",
    "email",
    "dob",
    "phone",
    "type",
    "sponsorId",
    "placementId",
  ],

  // admin fields
  admin: ["initial", "fullName", "password", "email", "phone", "type"],

  // Transactions Fields
  transactions: ["amount", "type"],

  // TDS Fields
  tds: ["userId", "type", "typeId", "amount"],

  // Routes Fields
  routes: ["name", "key", "route", "auth", "type", "noCollapse"],

  // Source fields
  src: ["title", "type", "rule", "range"],

  // Connection Fields
  con: ["userId", "storage", "transactionId"],

  // Slabs Fields
  slab: ["range", "space", "rent", "basicAmt", "tax", "type"],

  // Royality
  royality: ["range", "level", "rate", "rule", "status", "designation"],

  // Rewards Fields
  rewards: ["range", "rule", "type", "reward", "salary"],

  // Rent Fields
  rent: ["userId", "level", "storage", "amount", "connectionId", "status"],

  // Notifications Fields
  notif: ["userId", "title", "sourceId", "sourceType"],

  // LimitRewards Fields
  claims: ["range", "rule", "type"],

  // KYC Fields
  kyc: [
    "userId",
    "bankName",
    "accountNo",
    "IFSC",
    "holder",
    "aadharNo",
    "panNo",
    "nomineeName",
    "nomineeRel",
    "nomineeAge",
  ],

  kycFiles: ["aadharFront", "aadharBack", "panFile", "sign"],

  // Income Fields
  income: ["userId", "amount", "type", "status"],

  // consultation Fields
  consul: ["range", "type", "rate"],

  // Business Transaction
  bussTransaction: ["amount", "type", "userId"],

  // Address Fields
  address: [
    "userId",
    "street",
    "city",
    "state",
    "country",
    "postalCode",
  ],
};
