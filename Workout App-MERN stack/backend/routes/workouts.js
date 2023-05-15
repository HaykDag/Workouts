const express = require('express');

const {createWorkout,
        getWorkouts,
        getSingleWorkout,
        deleteWorkout,
        updateWorkout,
        getPublicWorkouts,
        addComment,
        likeWorkout
    } = require('../controlllers/workoutController');
const requireAuth = require('../middleWare/requireAuth');

const router = express.Router();

//get public workouts
router.get('/public',getPublicWorkouts)

//require auth for all workout routes and addind user_id to the "req" object
router.use(requireAuth);

//get all workouts
router.get('/', getWorkouts);

//get single workout
router.get('/:id',getSingleWorkout);

//Post a new workout
router.post('/',createWorkout);

//Delete workout
router.delete('/:id',deleteWorkout);

//Update workout
router.patch('/:id',updateWorkout)

//Add comment to a public workout
router.patch('/public/:id',addComment)

//like or unlike a workout
router.patch('/public/like/:id',likeWorkout)

module.exports = router;