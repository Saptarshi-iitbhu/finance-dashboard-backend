import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authorized, please login" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User no longer exists" });
        }

        if (user.status === 'INACTIVE') {
            return res.status(403).json({ message: "Account is inactive. Contact Admin." });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Session expired or invalid token" });
    }
};

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access Denied: Role (${req.user.role}) is not authorized.` 
            });
        }
        next();
    };
};