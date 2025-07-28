import { Router } from "express";
import { filmsController } from "../controllers/films";

const filmsRouter = Router();

filmsRouter.get("/", filmsController.getFilmsHandler);
filmsRouter.get("/:id", filmsController.getFilmByIdHandler);
filmsRouter.post("/", filmsController.createFilmHandler);
filmsRouter.put("/:id", filmsController.updateFilmHandler);
filmsRouter.delete("/:id", filmsController.deleteFilmHandler);

export default filmsRouter; 