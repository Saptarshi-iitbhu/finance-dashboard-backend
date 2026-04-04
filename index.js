import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; 
import connectDB from "./src/config.js";
import userRoutes from "./src/routes/userRoutes.js";
import recordRoutes from "./src/routes/recordRoutes.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieParser()); 

app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);

app.get('/', (req, res) => {
    res.send('Zorvyn Finance API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});