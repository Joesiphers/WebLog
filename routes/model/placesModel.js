const mongoose=require('mongoose');

const placesSchema=new mongoose.Schema({//以前忘记写 new。
    //pid:{type:String},
    name:{type:String, required:true},
    description:{type:String,required:false},
    location:{
        lag:{type:Number},
        lng:{type:Number}
    },
    image:{type:String},
    creator:{type:mongoose.Types.ObjectId,required:true, ref:'Users'}
});

module.exports=mongoose.model('Places',placesSchema);
