const user=require('../models/user')
const jwt = require('jsonwebtoken');

const bcrypt=require('bcrypt')
exports.getData=(req, res)=>{
    user.findAll()
    .then(data=>{
        res.json(data)
    })
    .catch(()=>console.log(err))
}

exports.postData =async (req, res)=>{
    const {name, email, password}=req.body;
    console.log('password=', password)
    try{
     const hash= await bcrypt.hash(password,10)
     const u1=new user({name:name,email:email,password:hash,ispremiumuser:false})
     await u1.save();
   // await user.create({name, email,password:hash,ispremiumuser:false})
    res.status(201).json({ message: 'Successfully created new user' });
     }
    catch(err){
        console.log('err occurced')
        res.status(303).json({ message: 'An error occurred while creating the user' });
    }
}

function generatToken(id){
    return jwt.sign({userId:id},process.env.JWT_Token)
  }

exports.login=async (req, res)=>{
    const {email, password}=req.body;
    let id;
try{
    const User= await user.find({email:email})
    if(User.length==0){
        return res.status(403).json({ message: 'User not found'});
    }
    console.log(User)
    const hash=User[0].password;
    const token=generatToken(User[0]._id)
    const premimum=User[0].ispremiumuser;
    console.log('premium show', premimum,User[0]._id)
   
    const isMatch = await bcrypt.compare(password, hash);
if(!isMatch){
    return res.status(401).json({ message: 'Invalid password' });
}
res.status(200).json({ message: 'Login successful',token,premimum });
}
catch(err){
    res.status(404).json({ message: 'An error occurred while logging in' });
}
}

