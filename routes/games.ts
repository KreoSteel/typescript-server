import { Router } from "express";
import { gamesController } from "../controllers/games";

const gamesRouter = Router();

gamesRouter.get("/", gamesController.getGamesHandler);
gamesRouter.get("/:id", gamesController.getGameByIdHandler);
gamesRouter.post("/", gamesController.createGameHandler);
gamesRouter.put("/:id", gamesController.updateGameHandler);
gamesRouter.delete("/:id", gamesController.deleteGameHandler);

export default gamesRouter; 