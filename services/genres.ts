import client from "../utils/client";
import { Genre } from "../types/genres";
import { ObjectId } from "mongodb";

const genreService = {
    async getGenres(): Promise<Genre[]> {
        return await client.collection<Genre>("genres").find().toArray();
    },
    async getGenreById(id: string): Promise<Genre> {
        const foundGenre = await client.collection<Genre>("genres").findOne({ _id: new ObjectId(id) });
        if (!foundGenre) {
            throw new Error(`Genre with id ${id} not found`);
        }
        return foundGenre;
    },
    async createGenre(genre: Genre): Promise<Genre> {
        const result = await client.collection<Genre>("genres").insertOne(genre);
        if (!result.insertedId) {
            throw new Error("Failed to create genre");
        }
        return { ...genre, _id: result.insertedId as ObjectId };
    },
    async updateGenre(id: string, genre: Genre): Promise<Genre> {
        const result = await client.collection<Genre>("genres").updateOne({ _id: new ObjectId(id) }, { $set: genre });
        if (result.matchedCount === 0) {
            throw new Error(`Genre with id ${id} not found`);
        }
        return { ...genre, _id: result.upsertedId as ObjectId };
    },
    async deleteGenre(id: string): Promise<void> {
        const result = await client.collection<Genre>("genres").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            throw new Error(`Genre with id ${id} not found`);
        }
    }
};

export default genreService;