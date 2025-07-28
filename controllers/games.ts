import { Request, Response } from "express";
import { getGames, getGameById, createGame, updateGame, deleteGame } from "../services/games";

export const gamesController = {
    getGamesHandler: async (req: Request, res: Response) => {
        try {
            const games = await getGames();
            res.json(games);
        } catch (error) {
            console.error("Error getting games:", error);
            res.status(500).json({ error: "Failed to get games" });
        }
    },

    getGameByIdHandler: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const game = await getGameById(id);
            res.json(game);
        } catch (error) {
            console.error("Error getting game by id:", error);
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({ error: "Game not found" });
            } else {
                res.status(500).json({ error: "Failed to get game" });
            }
        }
    },

    createGameHandler: async (req: Request, res: Response) => {
        try {
            console.log("=== CREATE GAME CONTROLLER START ===");
            console.log("Request method:", req.method);
            console.log("Request URL:", req.url);
            console.log("Request body:", JSON.stringify(req.body, null, 2));
            
            if (!req.body || Object.keys(req.body).length === 0) {
                console.error("❌ Request body is empty");
                return res.status(400).json({ error: "Request body is required" });
            }
            
            console.log("✅ Request body received, calling service...");
            const game = await createGame(req.body);
            
            console.log("✅ Game created successfully in controller");
            console.log("=== CREATE GAME CONTROLLER END ===");
            res.status(201).json(game);
            
        } catch (error) {
            console.error("=== CREATE GAME CONTROLLER ERROR ===");
            console.error("Error:", error);
            console.error("=== END ERROR ===");
            
            res.status(500).json({ 
                error: "Failed to create game", 
                details: error instanceof Error ? error.message : String(error)
            });
        }
    },

    updateGameHandler: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const game = await updateGame(id, req.body);
            res.json(game);
        } catch (error) {
            console.error("Error updating game:", error);
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({ error: "Game not found" });
            } else {
                res.status(500).json({ error: "Failed to update game" });
            }
        }
    },

    deleteGameHandler: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await deleteGame(id);
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting game:", error);
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({ error: "Game not found" });
            } else {
                res.status(500).json({ error: "Failed to delete game" });
            }
        }
    }
} 