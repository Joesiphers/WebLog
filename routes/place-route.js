const express = require('express'); 
const {check}=require('express-validator');
const fileUploader=require('../middleware/file-upload');
const router= express.Router();
const HttpError = require('./model/http-error.js');
const placeControllers=require ('./controllers/place-controller')
const CheckAuth=require('../middleware/checkAuth');

router.get('/:pid', placeControllers.getPlaceById);
router.get('/user/:uid', placeControllers.getPlaceByUserId);
const checkCreatePlace=[
    check('name').trim().not().isEmpty(),
    check('description').isLength({min:5}),
    check('creator').not().isEmpty()
];
router.use(CheckAuth);

router.post('/',
    fileUploader.single('image' ),
    checkCreatePlace,
    placeControllers.createPlace);

router.patch('/:pid',fileUploader.single('image'),[check('name').trim().not().isEmpty(),check('description').isLength({min:5,max:30})],placeControllers.updatePlace);
router.delete('/:pid',placeControllers.deletePlace);
module.exports= router;

