import express from "express"
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import { createRecord, getRecords } from "../controllers/recordController.js";

const recordRouter = express.Router();

recordRouter.get("/", protect, getRecords);

recordRouter.post("/", protect, authorizeRoles("ADMIN"), createRecord);
recordRouter.delete("/:id", protect, authorizeRoles("ADMIN"), createRecord);

recordRouter.get("/summary", protect, getDashboardSummary);

export default recordRouter