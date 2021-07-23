const express=require('express');
const fs=require('fs');
//const path=require('path');
const app=express();
//const bodyParser=require('body-parser');
const HttpError = require('./routes/model/http-error.js');
const placeRoutes=require('./routes/place-route.js');
const userRoutes=require('./routes/user-route.js');
const mongoose=require('mongoose');
let cors=require('cors');
app.use(express.json()); 
 app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Headers','X-Auth-Token,Origin,X-Requested-With','Content-Type','Accept','Authorization');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,PATCH,DELETE');
    next();
}  );
app.use(cors());
app.use((req,res, next) => {console.log("app use received",req.url,req.method,"body:",req.body);next()});
app.use('/api/places',placeRoutes);
app.use('/api/users', userRoutes);
app.use('/uploads/images', express.static('uploads/images'));//path.join('uploads','images')));
app.use((req,res, next) => {
    const error=new HttpError('connot find the route',401);
    throw error;
//上面这个没有写具体的路径，就不会有next。相当于对所有预期外的路径（其实就是错误的路径）反馈的（错误）信息
});
app.use((error, req,res,next)=>{ //唯一的要有error在最前面的，对所有的错误的反应。
    if (req.file){fs.unlink(req.file.path,(err)=>{console.log (err)}) };
    if (res.headersSent){ //注意是headers
        //console.log('more error');
        return next (error);
    };
    console.log(error,"app.js");
    res.status(error.code||500).json({message: error.message || 'An unknown error occurred!'})
});
try {
mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.vzwzd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
, { useNewUrlParser: true, useUnifiedTopology: true });
app.listen(5000) 
} catch (err){
    console.log('mongoDB connection fail',403);
return (err)
}
 