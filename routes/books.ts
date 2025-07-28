import { Router } from "express";
import { booksController } from "../controllers/books";

const booksRouter = Router();

booksRouter.get("/", booksController.getBooksHandler);
booksRouter.get("/:id", booksController.getBookByIdHandler);
booksRouter.post("/", booksController.createBookHandler);
booksRouter.put("/:id", booksController.updateBookHandler);
booksRouter.delete("/:id", booksController.deleteBookHandler);

export default booksRouter