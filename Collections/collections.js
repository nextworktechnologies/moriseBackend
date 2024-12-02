import { client } from "../dbConnection.js";
const collections = {
  transCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("transactions"),
  documentCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("documents"),
  categoryCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("categoy"),
  mediaCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("media"),
  userCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("users"),
  addressCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("address"),
  notifCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("notifications"),
  occupationCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("occupation"),
  qualificationCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("qualification"),
  queryCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("query"),
  sourceCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("source"),
  paymentCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("paymentHistory"),
  testimonialsCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("testimonials"),
  callCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("call"),
};

export default collections;
