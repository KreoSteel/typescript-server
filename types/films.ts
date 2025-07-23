import { ObjectId } from "mongodb";
import { Genre } from "./genres";

export interface Film {
    _id: ObjectId;
    title: string;
    director: string;
    releaseYear: number;
    genre: Genre[];
    rating: number;
    status: 'planned' | 'watching' | 'finished';
    isFavorite: boolean;
}