import { Router } from "express";
import genresController from "../controllers/genres";

const genresRoutes = Router();

genresRoutes.get("/", genresController.getGenresHandler);
genresRoutes.get("/:id", genresController.getGenreByIdHandler);
genresRoutes.post("/", genresController.createGenreHandler);
genresRoutes.put("/:id", genresController.updateGenreHandler);
genresRoutes.delete("/:id", genresController.deleteGenreHandler);

export default genresRoutes;