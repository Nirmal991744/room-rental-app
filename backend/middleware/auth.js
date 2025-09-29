const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth=async (req,res,next)=>{
  try {
    const token=req.header('Authorization').split(' ')[1];
    // console.log(token);
    
    if(!token){
      return res.status(404).json({
        success:false,
        message:"Access denied. No token provided."
      });
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const user=await User.findById(decoded.userId).select('-password');
    // console.log(decoded);
    
    if(!user){
      return res.status(404).json({success:false,
        message:'Token is not valid'
      })
    }
    req.user=user;
    next();
  } catch (error) {
    res.status(401).json({
      success:false,message:'NO token found!'
    })
  }
}

// Check if user is owner
const isOwner = (req, res, next) => {
  if (req.user.role !== 'owner') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Owner privileges required.'
    });
  }
  next();
};

module.exports = { auth, isOwner };