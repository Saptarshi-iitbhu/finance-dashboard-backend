import mongoose from "mongoose"
import { required } from "zod/mini"

const recordSchema = new mongoose.Schema({
    amount:{
        type: Number,
        required: true,
        min: [0, "Amount cannot be negative"]
    },
    type:{
        type: String,
        enum: ['INCOME', 'EXPENSE'],
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categoryModel',
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    description:{
        type: String,
        trim: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    }
}, {timestamps: true})

export default mongoose.model('Record', recordSchema)