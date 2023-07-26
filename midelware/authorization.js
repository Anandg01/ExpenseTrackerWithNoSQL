const jwt=require('jsonwebtoken');
const User=require('../models/user')

  exports.authenticate= (req, res, next)=>{
   try{
   const token=req.header('Authorizan');
   const decodeToken=(jwt.verify(token,'854215f63ef23342'))
   User.find({_id:decodeToken.userId}).then(user=>{
    req.user=user[0];
   next()
   }).catch(err=>{throw new Error(err)})
} 
   catch(err){
    console.log(err)
    return res.status(401).json({success:false})
   }
}
