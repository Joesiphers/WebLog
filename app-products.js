const express=require('express');
const app=express();
//const bodyParser=require('body-parser');
const HttpError = require('./routes/model/http-error.js');
const mongoose=require('./mongoose.js');

app.use(express.json()); 
//auto extract json and overide these on body,then auto go next;
app.post('/products', mongoose.createProducts);
app.get('/products', mongoose.getProducts);
app.use((req,res, next) => {
    const error=new HttpError('connot find the route',401);
    throw error;
//上面这个没有写具体的路径，就不会有next。相当于对所有预期外的路径（其实就是错误的路径）反馈的（错误）信息
});
app.use((error, req,res,next)=>{
    if (res.headersSent){ //注意是headers
        console.log('more error');
        return next (error);
    };
    
    res.status(error.code||500).json({message: error.message || 'An unknown error occurred!'})
});

app.listen(5000)  