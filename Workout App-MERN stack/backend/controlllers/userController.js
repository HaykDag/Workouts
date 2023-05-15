const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id)=>{
    return jwt.sign({_id},process.env.SECRET,{expiresIn: '3d'})
    
}

//login user
const loginUser = async (req,res)=>{
    const {email , password} = req.body;
    try{
        const user = await User.login(email,password);
        //create token
        const token = createToken(user._id);
        const {name,lastName} = user;
        res.status(200).json({email,token,name,lastName});
    }catch(error){
        res.status(400).json({error:error.message});
    }
}

//signup user
const signupUser = async (req,res)=>{
    const { email, password } = req.body;
    try{
        const user = await User.signup(email,password);
        //create token
        const token = createToken(user._id);

        res.status(200).json({email, token})
    }catch(error){
        res.status(400).json({error:error.message})
    }
}

//get user info
const getUser = async (req,res)=>{

    const {email} = req.params;

    const exist = await User.findOne({email:email})
    
    if(exist){
       return  res.status(200).json(exist)
    }else{
        return res.status(400).json({error:"chem gtnum"})
    }

}

//edit User
const editUser = async (req,res)=>{
    const {id} = req.params;
    
    const exist = await User.findOne({_id:id});
    
    if(exist){
        try{
            await exist.updateOne({...req.body});
            return res.status(200).json(exist)
        }catch(err){
            return res.status(400).json({error:err.message})
        }
    }else{
        return res.status(400).json({error:"unauthorized operation: Not your workout!"})
    }
    
}

module.exports = {signupUser,loginUser,getUser, editUser};