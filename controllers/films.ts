import { Request, Response } from "express";
import { getFilms, getFilmById, createFilm, updateFilm, deleteFilm } from "../services/films";

export const filmsController = {
    getFilmsHandler: async (req: Request, res: Response) => {
        try {
            const films = await getFilms();
            res.json(films);
        } catch (error) {
            console.error("Error getting films:", error);
            res.status(500).json({ error: "Failed to get films" });
        }
    },

    getFilmByIdHandler: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const film = await getFilmById(id);
            res.json(film);
        } catch (error) {
            console.error("Error getting film by id:", error);
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({ error: "Film not found" });
            } else {
                res.status(500).json({ error: "Failed to get film" });
            }
        }
    },

    createFilmHandler: async (req: Request, res: Response) => {
        try {
            console.log("=== CREATE FILM CONTROLLER START ===");
            console.log("Request method:", req.method);
            console.log("Request URL:", req.url);
            console.log("Request body:", JSON.stringify(req.body, null, 2));
            
            if (!req.body || Object.keys(req.body).length === 0) {
                console.error("❌ Request body is empty");
                return res.status(400).json({ error: "Request body is required" });
            }
            
            console.log("✅ Request body received, calling service...");
            const film = await createFilm(req.body);
            
            console.log("✅ Film created successfully in controller");
            console.log("=== CREATE FILM CONTROLLER END ===");
            res.status(201).json(film);
            
        } catch (error) {
            console.error("=== CREATE FILM CONTROLLER ERROR ===");
            console.error("Error:", error);
            console.error("=== END ERROR ===");
            
            res.status(500).json({ 
                error: "Failed to create film", 
                details: error instanceof Error ? error.message : String(error)
            });
        }
    },

    updateFilmHandler: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const film = await updateFilm(id, req.body);
            res.json(film);
        } catch (error) {
            console.error("Error updating film:", error);
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({ error: "Film not found" });
            } else {
                res.status(500).json({ error: "Failed to update film" });
            }
        }
    },

    deleteFilmHandler: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await deleteFilm(id);
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting film:", error);
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({ error: "Film not found" });
            } else {
                res.status(500).json({ error: "Failed to delete film" });
            }
        }
    }
} 