const Workout = require('../models/workoutModel');
const mongoose = require('mongoose');

//get all workuots
const getWorkouts = async (req,res)=>{
    const user_id = req.user._id
    const workouts = await Workout.find({user_id}).sort({createdAt: -1});
    res.status(200).json(workouts);
}
//get all Public workuots
const getPublicWorkouts = async (req,res)=>{
    const workouts = await Workout.find({isPublic:true}).sort({createdAt: -1});
    res.status(200).json(workouts);
}

//get single workout
const getSingleWorkout = async (req,res)=>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"no such workout"})
    }

    const workout = await Workout.findById(id);

    if(!workout){
        return res.status(404).json({error:"no such workout"});
    }

    res.status(200).json(workout)
}

//create new workout
const createWorkout = async(req,res)=>{
    const {title, load , reps, isPublic,email} = req.body; //this is why we need <app.use(express.json())> middleware in the server module
    
    let emptyFields = [];
    
    if(!title) emptyFields.push('title');
    if(!load) emptyFields.push('load');
    if(!reps) emptyFields.push ('reps');
    if(emptyFields.length>0){
        return res.status(400).json({error:"Please fill in all the fields",emptyFields})
    }
    
    //add doc to db
    const user_id = req.user._id;

    try{
        const workout = await Workout.create({title,load,reps,isPublic,user_id,email,comments:[],likes:[]});
        res.status(200).json(workout);
    }catch(err){
        res.status(400).json({error:err.message,emptyFields})
    }
}
///delete workout
const deleteWorkout = async (req,res)=>{
    
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"no such workout"})
    }
    
    // const workout = await Workout.findOneAndDelete({_id:id});

    const workout = await Workout.findOne({_id:id});

    //check if the user is deleting his own workout
    if(workout.email===req.user.email){
        workout.deleteOne();
    }else{
        return res.status(400).json({error:"unauthorized operation: Not your workout!"})
    }
    if(!workout){
        return res.status(404).json({error:"no such workout"});
    }
    res.status(200).json(workout);
}
//update workout
const updateWorkout = async (req,res)=>{

    const {title, load , reps} = req.body; //this is why we need <app.use(express.json())> middleware in the server module
    
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"no such workout"})
    }

    const workout = await Workout.findOne({_id:id});

    //const workout = await Workout.findOneAndUpdate({_id:id},{...req.body});

    //first check if the user is updating his workout or not.
    if(workout.email===req.user.email){
        try{
            const w = await workout.updateOne({...req.body});
            return res.status(200).json(w)
        }catch(err){
            return res.status(400).json({error:err.message})
        }
        
    }else{
        return res.status(400).json({error:"unauthorized operation: Not your workout!"})
    }
    
}

//add comments to a public workout
const addComment = async(req,res)=>{
    
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"no such workout"})
    }
    const workout = await Workout.findOneAndUpdate({_id:id},{comments:[...req.body]});
    
    if(!workout){
        return res.status(404).json({error:"no such workout"});
    }
    res.status(200).json(workout);
}

//like public workouts
const likeWorkout = async (req,res)=>{
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error:"no such workout"})
    }
    const workout = await Workout.findOneAndUpdate({_id:id},{likes:[...req.body]});
    
    if(!workout){
        return res.status(404).json({error:"no such workout"});
    }
    res.status(200).json(workout);
}
module.exports = {createWorkout,
                    getWorkouts,
                    getSingleWorkout,
                    deleteWorkout,
                    updateWorkout,
                    getPublicWorkouts,
                    addComment,
                    likeWorkout
                }