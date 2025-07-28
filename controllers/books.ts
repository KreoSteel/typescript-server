import { Request, Response } from "express";
import { getBooks, getBookById, createBook, updateBook, deleteBook } from "../services/books";

export const booksController = {
    getBooksHandler: async (req: Request, res: Response) => {
        try {
            const books = await getBooks();
            res.json(books);
        } catch (error) {
            console.error("Error getting books:", error);
            res.status(500).json({ error: "Failed to get books" });
        }
    },

    getBookByIdHandler: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const book = await getBookById(id);
            res.json(book);
        } catch (error) {
            console.error("Error getting book by id:", error);
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({ error: "Book not found" });
            } else {
                res.status(500).json({ error: "Failed to get book" });
            }
        }
    },

    createBookHandler: async (req: Request, res: Response) => {
        try {
            console.log("=== CREATE BOOK CONTROLLER START ===");
            console.log("Request method:", req.method);
            console.log("Request URL:", req.url);
            console.log("Request body:", JSON.stringify(req.body, null, 2));
            
            if (!req.body || Object.keys(req.body).length === 0) {
                console.error("❌ Request body is empty");
                return res.status(400).json({ error: "Request body is required" });
            }
            
            console.log("✅ Request body received, calling service...");
            const book = await createBook(req.body);
            
            console.log("✅ Book created successfully in controller");
            console.log("=== CREATE BOOK CONTROLLER END ===");
            res.status(201).json(book);
            
        } catch (error) {
            console.error("=== CREATE BOOK CONTROLLER ERROR ===");
            console.error("Error:", error);
            console.error("=== END ERROR ===");
            
            res.status(500).json({ 
                error: "Failed to create book", 
                details: error instanceof Error ? error.message : String(error)
            });
        }
    },

    updateBookHandler: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const book = await updateBook(id, req.body);
            res.json(book);
        } catch (error) {
            console.error("Error updating book:", error);
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({ error: "Book not found" });
            } else {
                res.status(500).json({ error: "Failed to update book" });
            }
        }
    },

    deleteBookHandler: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            await deleteBook(id);
            res.status(204).send();
        } catch (error) {
            console.error("Error deleting book:", error);
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({ error: "Book not found" });
            } else {
                res.status(500).json({ error: "Failed to delete book" });
            }
        }
    }
}