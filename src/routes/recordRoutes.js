import express from "express"
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import { createRecord, getRecords, deleteRecord, updateRecord, getDashboardSummary } from "../controllers/recordController.js";

const recordRouter = express.Router();

recordRouter.get("/", protect, getRecords);

recordRouter.post("/", protect, authorizeRoles("ADMIN"), createRecord);
recordRouter.put("/:id", protect, authorizeRoles("ADMIN"), updateRecord);
recordRouter.delete("/:id", protect, authorizeRoles("ADMIN"), deleteRecord);

recordRouter.get("/summary", protect, getDashboardSummary);

export default recordRouter