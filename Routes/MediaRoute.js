import express from "express";
import MediaController from "../Controllers/Media/Media.js";
import { serverError } from "../Responses/index.js";
const routes = express.Router();
const media = new MediaController();

routes.post("/create-media", async (req, res) => {
  try {
    const val = await media.createMedia(req.body);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

routes.get("/get-media", async (req, res) => {
  try {
    const { page, limit = 10 } = req.query;
    const val = await media.getMedia(page, limit);
    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

routes.get("/get-media/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const val = await media.getMediaById(id);
    res.status(val.status).send(val);
  } catch (err) {
    res.status(serverError.status).send(serverError);
  }
});

routes.put("/update-media/:id", async (req, res) => {
    
  try {
    const val = await media.updateMedia(req);

    res.status(val.status).send(val);
  } catch (error) {
    res.status(serverError.status).send(serverError);
  }
});

routes;

export default routes;
