import { client } from "../dbConnection.js";
const collections = {
  documentCollection: () =>
    client.db(process.env.MONGO_DATABASE).collection("documents"),
};

export default collections;
