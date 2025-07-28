import { Request, Response } from "express";
import genreService from "../services/genres";
import { ObjectId } from "mongodb";
import { Genre } from "../types/genres";

const genresController = {
    getGenresHandler: async (req: Request, res: Response) => {
        try {
            const genres = await genreService.getGenres();
            res.json(genres);
        } catch (error) {
            res.status(500).json({ error: "Failed to get genres" });
        }
    },

    getGenreByIdHandler: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const genre = await genreService.getGenreById(id);
            if (!genre) {
                return res.status(404).json({ error: "Genre not found" });
            }
            res.json(genre);
        } catch (error) {
            res.status(500).json({ error: "Failed to get genre" });
        }
    },

    createGenreHandler: async (req: Request, res: Response) => {
        try {
            const { name, description } = req.body;
            const genre = await genreService.createGenre({ name, description, _id: new ObjectId() } as Genre);
            res.status(201).json({ message: "Genre created successfully", genre });
        } catch (error) {
            res.status(500).json({ error: "Failed to create genre" });
        }
    },

    updateGenreHandler: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { name, description } = req.body;
            const genre = await genreService.updateGenre(id, { name, description, _id: new ObjectId() } as Genre);
            res.json({ message: "Genre updated successfully", genre });
        } catch (error) {
            res.status(500).json({ error: "Failed to update genre" });
        }
    },

    deleteGenreHandler: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await genreService.deleteGenre(id);
            res.status(204).json({ message: "Genre deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Failed to delete genre" });
        }
    },
}

export default genresController;