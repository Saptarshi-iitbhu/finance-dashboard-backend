import mongoose from "mongoose";
import recordModel from "../models/recordModel.js"
import { DashboardService } from "../services.js";
import { recordSchema } from "../validations.js";

export const createRecord = async(req, res)=>{
    try {
        const validatedData = recordSchema.parse(req.body);
        const { amount, type, category, date, description, user } = validatedData;
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
        const { type, category, startDate, endDate, page = 1, limit = 10, search } = req.query;

        let query = { user: req.user._id, isDeleted: { $ne: true } };

        if (type) query.type = type;
        if (category && category.trim() !== "") {
            query.category = category;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        if (search) {
            query.description = { $regex: search, $options: 'i' };
        }

        const skip = (page - 1) * limit;

        const records = await recordModel.find(query)
            .sort({ date: -1 })
            .skip(skip)
            .limit(Number(limit));
            
        const total = await recordModel.countDocuments(query);

        res.status(200).json({
            records,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(page),
            totalRecords: total
        });
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};

export const updateRecord = async (req, res) => {
    try {
        const validatedData = recordSchema.partial().parse(req.body);
        const { id } = req.params;
        const record = await recordModel.findByIdAndUpdate(id, validatedData, { new: true, runValidators: true });
        if (!record) return res.status(404).json({ message: "Record not found" });
        res.status(200).json(record);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const deleteRecord = async (req, res) => {
    try {
        const record = await recordModel.findById(req.params.id);
        if (!record) return res.status(404).json({ message: "Record not found" });

        record.isDeleted = true;
        await record.save();
        res.status(200).json({ message: "Record removed" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user._id;
        const result = await DashboardService.getSummary(userId);
        res.status(200).json(result);

    } catch (err) {
        res.status(500).json({ message: "Summary error", error: err.message });
    }
};