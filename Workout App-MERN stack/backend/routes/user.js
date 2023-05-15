const express = require('express');
const requireAuth = require('../middleWare/requireAuth');

//controller functions
const { signupUser, loginUser, getUser, editUser } = require('../controlllers/userController')
const router = express.Router();


//login route
router.post('/login',loginUser);

//signup route
router.post('/signup',signupUser);


//get user info
router.get('/:email',getUser)

//require auth before editing the document
router.use(requireAuth);

//Edit user info
router.patch('/:id',editUser)

module.exports = router;