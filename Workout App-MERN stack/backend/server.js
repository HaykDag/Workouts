const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const workoutRoutes = require('./routes/workouts');
const userRoutes = require('./routes/user');


//express app
const app = express();

//middleware
app.use(express.json());//accetpts incoming req's body.


//routes
app.use('/api/workouts',workoutRoutes);
app.use('/api/user',userRoutes);

//connect to db
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        //listen for requests only when connected to db
        app.listen(process.env.PORT,()=>{
            console.log('connectec to the db and listening on port 4000')
        })
    })
    .catch((err)=>{
        console.log(err)
    })



