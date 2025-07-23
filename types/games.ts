import { ObjectId } from "mongodb";
import { Genre } from "./genres";

export interface Game {
    _id: ObjectId;
    title: string;
    developer: string;
    releaseYear: number;
    genre: Genre[];
    rating: number;
    status: 'planned' | 'playing' | 'finished';
    isFavorite: boolean;
}