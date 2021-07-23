const HttpError =require('../model/http-error');
//const uuid=require('uuid/v4');
//const { v4: uuid } = require('uuid');
const {validationResult}=require('express-validator');
//const {createPlaces} =require('../model/mongoose');
//const { response } = require('express');
const Place=require('../model/placesModel');
const User=require('../model/userModel');
const mongoose=require('mongoose');
const fs=require('fs');

const getPlaceById =async (req,res,next)=>{
    const placeId = req.params.pid //express provide params will generate {pid:p1} by "/:pid"webaddressbar no need this ':'
    //api/places/place1234
/*     const place= Dummy_Places.find((p)=>{
        return p.pid===placeId
    }); */
    let place;
    try {
        if (placeId==='all'){place=await Place.find();}
        else {place=await Place.findById(placeId);};
            
     console.log("get places",typeof place);
    } catch (err){const error= new HttpError(placeId,403);
    console.log(err);
    return next (error)
};
   
    if (!place){
        const error = new HttpError('can not find the place',401);
        return next (error);
    }
    res.json({place});
};
exports.getPlaceById=getPlaceById;

const getPlaceByUserId =async (req,res, next)=>{
    const userId = req.params.uid;
/*     const place=Dummy_Places.filter((p)=>{ //filter return all user, find return first find.
       //filter 没找到会返回空数组，find就返回undefined
        return p.creator===userId
    }); */
 //   console.log(userId===userId);
 let places;
    try{
       // places=await Place.find({creator:userId});
        places=await User.findById(userId).populate('places');
        
    } catch (err){
        const error= new HttpError("userId"+userId,403);
            console.log(err);
            return next (error)
    };
    console.log(userId, places);
    if (places.length<1){
        console.log('error')
        const error = new Error ('can not find place with user');
        error.code=402;
        throw error;
    };
    //can also use : if (!place ||place.length===0){...}
    res.json(places);
};
exports.getPlaceByUserId=getPlaceByUserId;

const createPlace = async (req,res,next)=>{
    const error=validationResult(req);
    //console.log(error);
    if (!error.isEmpty()){
        
        let errorMessages=error.errors.map((e)=>{
        return "check:"+e.param+" : "+e.value;});
        const errorMsg=errorMessages.toString();
        console.log(errorMsg);
        res.status(422).send(errorMsg); 
       throw new HttpError('check invalid input',422);
    };
    const {name,description, location,creator}=req.body;
    //console.log('body',name,location,creator);
    const createdPlace=new Place({
     //   pid:uuid(),
        name,
        description,
        location,
        creator,
        image:req.file.path,
    });
    console.log(createdPlace)
    let user;
    try {user=await User.findById(creator);}
    catch (err){
        const error = new HttpError ('can not find creator provided with place',405);
        res.json(error.message);
        return next (error);
    };
    try{
        //await createdPlace.save();
        const sess=await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({session:sess});
        user.places.push(createdPlace);
        await user.save({session:sess});
        console.log('commit');
        await sess.commitTransaction();
        sess.endSession();
    }
    catch (err){
        const error = new HttpError ('can not create place'+err,405);
        res.json(err);
        return next (error);
    };
    res.status(201).json(`place created succefully ${createdPlace}`)
    //const response = await createPlaces(createdPlace);
    //res.status(201).json(response);
};
exports.createPlace=createPlace;

const updatePlace=async (req,res, next)=>{
    //start validation check;
    console.log("update",req.body,req.file);
const error=validationResult(req);
    if (!error.isEmpty()){
        
        let errorMessages=error.errors.map((e)=>{
        return "check:"+e.param+" : "+e.value;});
        const er=errorMessages.toString();
        console.log(er);
        res.status(422).send(er); 
       throw new HttpError('invalid input',422);
    };
    //finished error check;
    const {name,description}=req.body;
    const pid=req.params.pid;
    let place;
    try {
        place=await Place.findById(pid);
        const creator=place.creator.toString();
        //
        if(req.userData.userId!==creator){
            const error = new HttpError (`only the creator can change`,400);
            //res.json(error);
            return next (error);
        }
        place.name=name;
        place.description=description;
        if (req.file){place.image=req.file.path};
    
    } catch (err){
       // const error = new HttpError ('can not update place'+err,405);
        console.log(err,"place-controller");
        //res.json(err);
        return next (err);
    };
    try {console.log(place);
        await place.save(); //这个结构有点怪。使用的是实例.save

    }
    catch (err){
        const error = new HttpError ('can not Save/update place'+err,405);
        res.json(err);
        return next (error);
    };
/*     const place=Dummy_
    //let pla={...place};
    let placeIndex= Dummy_Places.findIndex((p)=>{return p.pid===pid});
    place.name=name;
    place.description=description;
    //先拷贝数组出来，再更改其中2项，随后覆盖原dummy中的数组项。
    Dummy_Places[placeIndex]=place;
   // console.log(name,description,"place:",place,place.pid); */
    res.status(200).json({messgae:"successfully updated"})
};

const deletePlace= async (req,res, next)=>{
    const pid = req.params.pid;
    //check the to-del place exist?
    let place;
    try {place= await Place.findById(pid).populate('creator');
        console.log(place,"tobe deleted")
    }  catch (err){
        const error = new HttpError ('can not delete the place',405);
        res.json(err);
        return next (error);
    };
    if (!place){
        const error = new HttpError ('can not find the place to delete',400);
        res.json(err);
        return next (error);

    };const creator=place.creator.id;
    console.log("191",req.userData.userId,typeof(creator),creator);
    if(req.userData.userId!==creator){
        const error = new HttpError ('only the creator allow deleting',400);
        //res.json(err);
        return next (error);
    }
    try {
        //place.remove();
        const session=await mongoose.startSession();//forgot the await
        session.startTransaction();
        await place.remove({session:session});
        place.creator.places.pull(place);
        await place.creator.save({session:session});
        await session.commitTransaction();
        session.endSession();
        }
    catch (err){
        const error = new HttpError ('can not delete the place'+err,405);
  //      res.json(err);
        return next (error);
    };
    /* if (!Dummy_Places.find(p=>p.pid===pid)){
        throw new HttpError('could not find the place to delete',404)};
    console.log('got delete message');    
    delPlaces=Dummy_Places.filter(p=>{return p.pid!==pid});//throw out to delete one.
    Dummy_Places=delPlaces;
    console.log(`deleted ${pid}`); */
   // console.log(place.image);
    if (place.image){
        fs.unlink(place.image,(err)=>{console.log (err)})};
    res.status(200).json(`The place is deleted ${place} `);

};

exports.updatePlace=updatePlace;
exports.deletePlace=deletePlace;
//之前用了 const Dummy_Places,发现无法删除记录的操作，显示assigment to constant variable.
