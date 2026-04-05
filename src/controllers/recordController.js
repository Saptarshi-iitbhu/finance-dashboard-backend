import recordModel from "../models/recordModel.js"

export const createRecord = async(req, res)=>{
    try {
        const { amount, type, category, date, description, user } = req.body
        const targetUser = user || req.user._id;

        const newRecord = new recordModel({
            user: targetUser,
            amount: amount,
            type: type,
            category: category,
            date: date,
            description: description,
            createdBy: req.user._id
        })

        const record = await newRecord.save();
        res.status(200).json(record);
    } catch (err) {
        res.status(400).json({ message: "Internal Server Error", error: err.message });
    }
};

export const getRecords = async(req, res) => {
    try {
        const { type, category, startDate, endDate } = req.query;

        let query = { user: req.user._id };

        if (type) query.type = type;
        if (category && category.trim() !== "") {
            query.category = category;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const records = await recordModel.find(query).sort({ date: -1 });
        res.status(200).json(records);
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export const deleteRecord = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id);
        if (!record) return res.status(404).json({ message: "Record not found" });

        await record.deleteOne();
        res.status(200).json({ message: "Record removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const stats = await recordModel.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(userId) } },
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
                    type: 'EXPENSE' 
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

        const recentActivity = await recordModel.find({ user: userId })
            .sort({ date: -1 })
            .limit(5)
            .populate('category', 'name');

        res.status(200).json({
            summary,
            categoryStats,
            recentActivity
        });

    } catch (err) {
        res.status(500).json({ message: "Summary error", error: err.message });
    }
};