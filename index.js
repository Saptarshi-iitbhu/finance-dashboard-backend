import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import connectDB from "./src/config.js"

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Zorvyn Finance API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}`);
});