
const Place=require('./placesModel');
/* const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://zhouwg:ccciiiooo@cluster0.vzwzd.mongodb.net/places?retryWrites=true&w=majority'
, { useNewUrlParser: true, useUnifiedTopology: true }
).then(()=>{}).catch((err)=>{console.log(err)}); */

async function createPlaces(req){
    
    console.log('new place :',req);
     const toCreateProduct=new Place(
        {
        name:req.name,
        description:req.description,
        location:req.location,
        creator:req.creator
        }
    );
    console.log('new place :', toCreateProduct);
    await toCreateProduct.save(); 
    return response='create success'+toCreateProduct;
};
exports.createPlaces=createPlaces;

const getPlaces=async (req,res,next)=>{
     try {const gotProduct=await Product.find(
         {name:req.body.name}).exec();
    console.log(gotProduct,gotProduct[0]._id.getTimestamp(),gotProduct.price);
    res.json(gotProduct)//._id.getTimestamp());
    }
    catch (err){res.json(err);console.log(err)}
    
};
exports.getPlaces=getPlaces;
