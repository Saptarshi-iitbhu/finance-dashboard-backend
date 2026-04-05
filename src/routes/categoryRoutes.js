import express from "express"
import { createCategory, getCategories } from "../controllers/categoryController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const categoryRouter = express.Router();

categoryRouter.get('/', protect, getCategories);
categoryRouter.post('/', protect, authorizeRoles("ADMIN"), createCategory);

export default categoryRouter