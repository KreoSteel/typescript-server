import client from "../utils/client";
import type { Game } from "../types/games";
import { ObjectId } from "mongodb";

export async function getGames(): Promise<Game[]> {
    const games = await client.collection<Game>("games").find().toArray();
    if (!games) {
        throw new Error("Failed to get games");
    }
    return games;
}

export async function getGameById(id: string): Promise<Game> {
    const foundGame = await client.collection<Game>("games").findOne({ _id: new ObjectId(id) });
    if (!foundGame) {
        throw new Error(`Game with id ${id} not found`);
    }
    return foundGame;
}

export async function createGame(game: Game): Promise<Game> {
    try {
        console.log(`[GamesService] Attempting to create game: ${game.title}`);
        
        if (!game.title || !game.developer || !game.releaseYear || !game.genre || game.rating === undefined || !game.status || game.isFavorite === undefined) {
            console.error("[GamesService] Validation failed: Missing required fields", { game });
            throw new Error("All fields are required");
        }
        
        // Additional validation
        if (typeof game.releaseYear !== 'number' || game.releaseYear < 1950 || game.releaseYear > new Date().getFullYear() + 1) {
            throw new Error(`Invalid release year: ${game.releaseYear}. Must be between 1950 and ${new Date().getFullYear() + 1}`);
        }
        
        if (typeof game.rating !== 'number' || game.rating < 0 || game.rating > 10) {
            throw new Error(`Invalid rating: ${game.rating}. Must be between 0 and 10`);
        }
        
        const result = await client.collection<Game>("games").insertOne(game);
        
        const createdGame = { ...game, _id: result.insertedId as ObjectId };
        console.log(`[GamesService] Successfully created game with ID: ${createdGame._id}`);
        return createdGame;
    } catch (error) {
        console.error("[GamesService] Database error while creating game:", error);
        if (error instanceof Error && error.message === "All fields are required") {
            throw error;
        }
        throw new Error(`Failed to create game: ${error instanceof Error ? error.message : 'Unknown database error'}`);
    }
}

export async function updateGame(id: string, game: Game): Promise<Game> {
    const result = await client.collection<Game>("games").updateOne({ _id: new ObjectId(id) }, { $set: game });
    if (result.matchedCount === 0) {
        throw new Error(`Game with id ${id} not found`);
    }
    return { ...game, _id: result.upsertedId as ObjectId };
}

export async function deleteGame(id: string): Promise<void> {
    const result = await client.collection<Game>("games").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
        throw new Error(`Game with id ${id} not found`);
    }
} 