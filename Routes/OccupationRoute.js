import express from "express";
import OccupationController from "../Controllers/OccupationController/Occupation.js";
import { serverError } from "../Responses/index.js";
const routes = express.Router();
const occupation = new OccupationController();

routes.get("/get-occupation", async (req, res) => {
  try {
    const { page, limit = 10 } = req.query;

    const val = await occupation.getOccupation(page, limit);
    console.log("val", val);

    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});
routes.post("/create-occupation", async (req, res) => {
  try {
    const val = await occupation.createOccupatoin(req.body);

    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

routes.put("/update-occupation", async (req, res) => {
  try {
    const val = await occupation.updateOccupation(req.body);

    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

routes.delete("/delete-occupation/:id", async (req, res) => {
  try {
    const val = await occupation.deleteOccupationById(req.params?.id);
    res.status(val.status).send(val);
  } catch (error) {
    console.error("Error deleting occupation:", error.message);
    res.status(serverError.status).send(serverError);
  }
});
export default routes;
