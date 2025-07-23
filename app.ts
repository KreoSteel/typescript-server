import express from "express";
import genresRoutes from "./routes/genres";

const app = express();

app.use("/genres", genresRoutes);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
