import client from "../utils/client";
import type { Film } from "../types/films";
import { ObjectId } from "mongodb";

export async function getFilms(): Promise<Film[]> {
    const films = await client.collection<Film>("films").find().toArray();
    if (!films) {
        throw new Error("Failed to get films");
    }
    return films;
}

export async function getFilmById(id: string): Promise<Film> {
    const foundFilm = await client.collection<Film>("films").findOne({ _id: new ObjectId(id) });
    if (!foundFilm) {
        throw new Error(`Film with id ${id} not found`);
    }
    return foundFilm;
}

export async function createFilm(film: Film): Promise<Film> {
    try {
        console.log(`[FilmsService] Attempting to create film: ${film.title}`);
        
        if (!film.title || !film.director || !film.releaseYear || !film.genre || film.rating === undefined || !film.status || film.isFavorite === undefined) {
            console.error("[FilmsService] Validation failed: Missing required fields", { film });
            throw new Error("All fields are required");
        }
        
        // Additional validation
        if (typeof film.releaseYear !== 'number' || film.releaseYear < 1888 || film.releaseYear > new Date().getFullYear() + 1) {
            throw new Error(`Invalid release year: ${film.releaseYear}. Must be between 1888 and ${new Date().getFullYear() + 1}`);
        }
        
        if (typeof film.rating !== 'number' || film.rating < 0 || film.rating > 10) {
            throw new Error(`Invalid rating: ${film.rating}. Must be between 0 and 10`);
        }
        
        const result = await client.collection<Film>("films").insertOne(film);
        
        const createdFilm = { ...film, _id: result.insertedId as ObjectId };
        console.log(`[FilmsService] Successfully created film with ID: ${createdFilm._id}`);
        return createdFilm;
    } catch (error) {
        console.error("[FilmsService] Database error while creating film:", error);
        if (error instanceof Error && error.message === "All fields are required") {
            throw error;
        }
        throw new Error(`Failed to create film: ${error instanceof Error ? error.message : 'Unknown database error'}`);
    }
}

export async function updateFilm(id: string, film: Film): Promise<Film> {
    const result = await client.collection<Film>("films").updateOne({ _id: new ObjectId(id) }, { $set: film });
    if (result.matchedCount === 0) {
        throw new Error(`Film with id ${id} not found`);
    }
    return { ...film, _id: result.upsertedId as ObjectId };
}

export async function deleteFilm(id: string): Promise<void> {
    const result = await client.collection<Film>("films").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
        throw new Error(`Film with id ${id} not found`);
    }
} 