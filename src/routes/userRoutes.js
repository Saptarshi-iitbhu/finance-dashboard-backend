import express from "express"
import { getAllUsers, getUserProfile, loginUser, logoutUser, registerUser, updateUserRoleOrStatus, deleteUser } from "../controllers/userController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);

userRouter.get('/dashboard', protect, getUserProfile);

userRouter.get('/all_profile', protect, authorizeRoles("ADMIN"), getAllUsers);
userRouter.put('/update/:id', protect, authorizeRoles("ADMIN"), updateUserRoleOrStatus);
userRouter.delete('/delete/:id', protect, authorizeRoles("ADMIN"), deleteUser);

export default userRouter