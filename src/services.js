import mongoose from "mongoose";
import recordModel from "./models/recordModel.js";

export class DashboardService {
    static async getSummary(userId) {
        const stats = await recordModel.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId), isDeleted: { $ne: true } } },
            { 
                $group: { 
                    _id: "$type", 
                    totalAmount: { $sum: "$amount" } 
                } 
            }
        ]);

        const summary = {
            totalIncome: stats.find(s => s._id === 'INCOME')?.totalAmount || 0,
            totalExpenses: stats.find(s => s._id === 'EXPENSE')?.totalAmount || 0,
        };
        summary.netBalance = summary.totalIncome - summary.totalExpenses;

        const categoryStats = await recordModel.aggregate([
            { 
                $match: { 
                    user: new mongoose.Types.ObjectId(userId), 
                    type: 'EXPENSE',
                    isDeleted: { $ne: true }
                } 
            },
            { 
                $group: { 
                    _id: "$category", 
                    amount: { $sum: "$amount" } 
                } 
            },
            {
                $lookup: {
                    from: "categories", 
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryDetails"
                }
            },
            { $unwind: "$categoryDetails" },
            { 
                $project: { 
                    _id: 0, 
                    categoryName: "$categoryDetails.name", 
                    amount: 1 
                } 
            }
        ]);

        const recentActivity = await recordModel.find({ user: userId, isDeleted: { $ne: true } })
            .sort({ date: -1 })
            .limit(5)
            .populate('category', 'name');

         return {
            summary,
            categoryStats,
            recentActivity
        };
    }
}