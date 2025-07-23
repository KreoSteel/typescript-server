import { ObjectId } from "mongodb";
import { Genre } from "./genres";

export interface Book {
    _id: ObjectId;
    title: string;
    author: string;
    publishedYear: number;
    pages: number;
    genre: Genre[];
    rating: number;
    status: 'planned' | 'reading' | 'finished';
    isFavorite: boolean;
}