import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        minlength: 5
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        minlength: 8
    },
    role:{
        type: String,
        enum: ['ADMIN', 'ANALYST', 'VIEWER'],
        default: 'VIEWER'
    },
    status:{
        type: String,
        enum: ['ONLINE', 'OFFLINE'],
        default: 'ONLINE'
    }
},{timestamps: true})

export default mongoose.model('User', userSchema)