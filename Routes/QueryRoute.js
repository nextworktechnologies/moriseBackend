import express from "express";
import QueryController from "../Controllers/Query/Query.js";
import { serverError } from "../Responses/index.js";

const routes = express.Router();

const query = new QueryController();
// get all queries for admin
routes.get("/get-query", async (req, res) => {
  try {
    const { page, limit = 10 } = req.query;
    const val = await query.getQuery(page, limit);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

// get queries for using usedId
routes.get("/get-query/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const val = await query.getQueryByUserId(id);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});
routes.post("/create-query", async (req, res) => {
  try {
    const val = await query.createQuery(req.body);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

routes.put("/update-query", async (req, res) => {
  try {
    const val = await query.updateQuery(req.body);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});
export default routes;
