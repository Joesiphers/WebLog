const mongoose=require('mongoose');
const Product=require('./model/products');

mongoose.connect('mongodb+srv://zhouwg:ccciiiooo@cluster0.vzwzd.mongodb.net/productTest?retryWrites=true&w=majority'
, { useNewUrlParser: true, useUnifiedTopology: true }
).then(()=>{}).catch(()=>{});

const createProducts=async (req,res,next)=>{
    const toCreateProduct=new Product(
        {name:req.body.name,
        price:req.body.price
        }
    );
    await toCreateProduct.save();
    res.json('create success')
};
exports.createProducts=createProducts;

const getProducts=async (req,res,next)=>{
     try {const gotProduct=await Product.find(
         {name:req.body.name}).exec();
    //console.log(gotProduct,gotProduct[0]._id.getTimestamp(),gotProduct.price);
    res.json(gotProduct)//._id.getTimestamp());
    }
    catch (err){res.json(err);console.log(err)}
    
};
exports.getProducts=getProducts;
