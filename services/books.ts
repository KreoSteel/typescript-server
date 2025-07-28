import client from "../utils/client";
import type { Book } from "../types/books";
import { ObjectId } from "mongodb";

export async function getBooks(): Promise<Book[]> {
    const books = await client.collection<Book>("books").find().toArray();
    if (!books) {
        throw new Error("Failed to get books");
    }
    return books;
}

export async function getBookById(id: string): Promise<Book> {
    const foundBook = await client.collection<Book>("books").findOne({ _id: new ObjectId(id) });
    if (!foundBook) {
        throw new Error(`Book with id ${id} not found`);
    }
    return foundBook;
}


export async function createBook(book: Book): Promise<Book> {
    try {
        console.log(`[BooksService] Attempting to create book: ${book.title}`);
        
        if (!book.title || !book.author || !book.publishedYear || !book.pages || !book.genre || book.rating === undefined || !book.status || book.isFavorite === undefined) {
            console.error("[BooksService] Validation failed: Missing required fields", { book });
            throw new Error("All fields are required");
        }
        
        // Additional validation
        if (typeof book.publishedYear !== 'number' || book.publishedYear < 1800 || book.publishedYear > new Date().getFullYear() + 1) {
            throw new Error(`Invalid published year: ${book.publishedYear}. Must be between 1800 and ${new Date().getFullYear() + 1}`);
        }
        
        if (typeof book.pages !== 'number' || book.pages <= 0) {
            throw new Error(`Invalid pages: ${book.pages}. Must be a positive number`);
        }
        
        if (typeof book.rating !== 'number' || book.rating < 0 || book.rating > 10) {
            throw new Error(`Invalid rating: ${book.rating}. Must be between 0 and 10`);
        }
        
        const result = await client.collection<Book>("books").insertOne(book);
        
        const createdBook = { ...book, _id: result.insertedId as ObjectId };
        console.log(`[BooksService] Successfully created book with ID: ${createdBook._id}`);
        return createdBook;
    } catch (error) {
        console.error("[BooksService] Database error while creating book:", error);
        if (error instanceof Error && error.message === "All fields are required") {
            throw error;
        }
        throw new Error(`Failed to create book: ${error instanceof Error ? error.message : 'Unknown database error'}`);
    }
}

export async function updateBook(id: string, book: Book): Promise<Book> {
    const result = await client.collection<Book>("books").updateOne({ _id: new ObjectId(id) }, { $set: book });
    if (result.matchedCount === 0) {
        throw new Error(`Book with id ${id} not found`);
    }
    return { ...book, _id: result.upsertedId as ObjectId };
}

export async function deleteBook(id: string): Promise<void> {
    const result = await client.collection<Book>("books").deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
        throw new Error(`Book with id ${id} not found`);
    }
}
