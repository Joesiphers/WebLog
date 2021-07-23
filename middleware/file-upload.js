const multer=require('multer');
//const uuid=require('uuid');
const {v4:uuid}=require('uuid');

const MIME_TYPE_MAP={
    "image/png":"png",
    "image/jpg":"jpg",
    "image/jpeg":"jpeg"
};
const fileUpload=multer({
    limits:50000000,
    storage:multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,"uploads/images");
        },
        filename:(req,file,cb)=>{
            const ext=MIME_TYPE_MAP[file.mimetype];
            cb(null, uuid()+'.'+ext);
        },
        fileFilter:(req,file,cb)=>{
            const isValid=!!MINE_TYPE_MAP(file.mimetype);
            let errorText=isValid?null:new Error("wrong type of image");
            cb(errorText, isValid)
        },

    })
});
module.exports =fileUpload;