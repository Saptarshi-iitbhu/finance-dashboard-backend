import mongoose from "mongoose"

const recordSchema = new mongoose.Schema({
    amount:{
        type: Number,
        required: true
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
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel',
        required: true
    }
}, {timestamps: true})

export default mongoose.model('Record', recordSchema)