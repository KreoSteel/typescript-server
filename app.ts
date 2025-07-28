import express from "express";
import genresRoutes from "./routes/genres";
import booksRouter from "./routes/books";
import filmsRouter from "./routes/films";
import gamesRouter from "./routes/games";

const app = express();

app.use(express.json());

// Basic request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Test route
app.get('/test', (req, res) => {
    console.log('Test route hit!');
    res.json({ message: 'Server is working!' });
});

app.use("/genres", genresRoutes);
app.use("/books", booksRouter);
app.use("/films", filmsRouter);
app.use("/games", gamesRouter);

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('=== GLOBAL ERROR ===');
    console.error('Error:', error);
    console.error('URL:', req.url);
    console.error('Method:', req.method);
    console.error('Body:', req.body);
    console.error('=== END ERROR ===');
    
    res.status(500).json({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error)
    });
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
