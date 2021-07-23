const HttpError =require('../routes/model/http-error');
const jwt=require('jsonwebtoken');

const CheckAuth=(req,res,next)=>{
    try {
        const token=req.headers.authorization.split(' ')[1]//authorization:'bearer token';
        if (!token){
            throw new Error ('Token not found, Authentificationfailed')
        };
    
    const decodedToken= jwt.verify(token, process.env.JWT_SE_KEY);
    req.userData={userId:decodedToken.userId};
    next()
    } catch (err){
const error=new HttpError ('Token not found, Authentificationfailed', 401);
        return next(error);
    }
};
module.exports=CheckAuth;