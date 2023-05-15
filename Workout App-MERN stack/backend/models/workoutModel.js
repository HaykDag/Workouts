const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    reps:{
        type: Number,
        required: true
    },
    load:{
        type: Number,
        required: true
    },
    user_id:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    isPublic:{
        type: Boolean,
        required: true
    },
    comments:{
        type: [[String,String,String]],
        required: true
    },
    likes:{
        type: [String],
        required: true
    }
},{timestamps: true });

module.exports = mongoose.model('Workout',workoutSchema);