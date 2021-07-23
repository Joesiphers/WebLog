const HttpError=require('../model/http-error');
//const {v4:uuid}=require('uuid');
const {validationResult}=require('express-validator');
const User=require('../model/userModel')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const getUsers=async (req,res,next)=>{
    const email=req.params.email;
    //const user=Dummy_User.filter((p=>p.uid===uid));
    let users;
    try{
        if (email==='all'){
             users=await User.find({},)}//'-password'
        else{users=await User.find({email:email},'-password')
        }
    } 
    catch (err){
        const error = new HttpError ("get user by ID failed",405);
        res.json('failed retrived users');
        return next (error);
    };
    if (users.length===0){
    const error=new HttpError('cannot find the users: '+email,404)
    return next (error) 
}
    else {
        res.status(200).json({
            users//: user.map(user=>user.toObject({getters:true}))
            });
        console.log('response', users);

    };
};

exports.getUsers=getUsers;

const userSignup=async (req,res,next)=>{
    //start validation check;
    console.log('req',req.body,req.file)
    const error=validationResult(req);
    if (!error.isEmpty()){
        let errorMessages=error.errors.map((e)=>{
            return "check:"+e.param+" : "+e.value;});
            const errorMsg=errorMessages.toString();
            console.log("error return",error);
            res.status(422).send(errorMsg); 
           return next( new HttpError('chek invalid input',422));

    };
    
    const {name,email,password}=req.body;
/*   const haveUser=Dummy_User.find(u=>u.email===email);
    if (haveUser){const error= new HttpError ('email registered',404);
    throw error;}; */
    let hasUser;
    try { hasUser=await User.findOne({email:email});}
    catch (err){
        const error = new HttpError (' SignUp failed please try again'+err,405);
        res.json(err);
        return next (error);
    };
    if (hasUser){const error= new HttpError ('email registered',405);
    return next (error)};
    let hasedPassword;
    try {
        hasedPassword=await bcrypt.hash(password,12);
    }
    catch(err){ 
        const error=new HttpError("sigup failed",500);
        return next(err)};

//上面检查email是否已经注册。
        const imgPath=req.file?req.file.path:"";
    const createdUser=new User({
        //uid:uuid(),mongoDB will generate
        name,
        email,
        password:hasedPassword,
        image:imgPath,
        places:[]
    });
    //Dummy_User.push(createdUser);
    try { await createdUser.save()}
    catch (err){
        const error = new HttpError ('can not Signup save'+err,405);
        res.json(err);
        return next (err);
    };
    let token;
    try{
        token=jwt.sign(
            {userId:createdUser.id,email:createdUser.email},
            'backkey-in-not-telling',
            {expiresIn:'1h'}) }
    catch(err){
        const error = new HttpError ('can not Signup token',401);
  //      res.json(err);
        return next (error);
    }
    
    res.status(200).json({messgae:"user created",userId:createdUser._id,name:createdUser.name,token:token});
};
exports.userSignup=userSignup;

const userLogin=async (req,res,next)=>{
    const {email,password}=req.body;
    console.log("post login",email,password,req.body);
 //   const idenf=Dummy_User.find(e=>{ e.email===email});
    let userExist;
    try {userExist=await User.findOne({
        email:email}
        )}
    catch (err){
        const error = new HttpError ('can not Login/check username and passowrd'+err,405);
        res.json(err);
        return next (error);
    };
    //  console.log(idenf.password, password);
/*     if (!idenf||idenf.password!==password){
        const error= new HttpError ('something wrong',404);
        throw error;
    } else {
        console.log('logged in');} */
        

        if (!userExist){
            const error= new HttpError ('user not found',404);
            return next(error);}
        let isValid;
        try {
            isValid=await bcrypt.compare(password,userExist.password);
            if(!isValid) {
                const error=new HttpError("invalid password",401);
                return next(error)}
            else {
                console.log('logged in');}
        }
        catch(err){ 
            const error=new HttpError("login failed",500);
            return next(err)}
         
        let token;
        try{
            token=jwt.sign({userId:userExist.id,email:userExist.email},process.env.JWT_SE_KEY,{expiresIn:'1h'}) }
            catch(err){
                const error = new HttpError ('login token',501);
                res.json(err);
                return next (err);
            };
            res.status(200).json({
                message:"login succefully", 
                userId:userExist.id,
                name:userExist.name,
                token:token})
        
};
exports.userLogin=userLogin;

