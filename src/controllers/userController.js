import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { registerSchema } from "../validations.js";

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
};

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const validatedData = registerSchema.parse({ email, password });
        const hashedPassword = await bcrypt.hash(password, 10);

        const userCount = await userModel.countDocuments();
        const assignedRole = userCount === 0 ? 'ADMIN' : 'VIEWER';

        const newUser = new userModel({
            username,
            email: validatedData.email,
            password: hashedPassword,
            role: assignedRole
        });

        const user = await newUser.save();
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60 * 1000
        });

        const { password: _, ...userWithoutPassword } = user.toObject();
        res.status(201).json(userWithoutPassword);

    } catch (err) {
        return res.status(500).json({ 
            message: "Internal Server Error", 
            errorName: err.name,
            errorMessage: err.message,
            stack: err.stack 
        });
    }
};

export const loginUser = async (req, res)=>{
    try{
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if(!user) {
            return res.status(400).json( { message: "User doesn't exists" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({ message: "Invalid Credentials"});
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.cookie("token", token, {
            ...cookieOptions,
            maxAge: 24 * 60 * 60 * 1000
        });

        const { password: _, ...userWithoutPassword } = user.toObject();
        return res.status(201).json(userWithoutPassword);
    } catch(err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logoutUser = async (req, res)=>{
    try{
        res.clearCookie("token", cookieOptions);
        return res.status(200).json({ message: "Logged Out Successfully" });
    } catch(err) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

    export const getUserProfile = async (req, res) => {
        try {
            const user = await userModel.findById(req.user._id).select("-password");
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user);
        } catch (err) {
            return res.status(500).json({ message: "Internal Server Error" });
        }
    };

export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password');
        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch users", error: err.message });
    }
};

export const updateUserRoleOrStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { role, status } = req.body; 

        const validRoles = ['ADMIN', 'ANALYST', 'VIEWER'];
        const validStatuses = ['ONLINE', 'OFFLINE'];

        if (role && !validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role provided" });
        }
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status provided" });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            id,
            { role, status },
            { new: true, runValidators: true } 
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};