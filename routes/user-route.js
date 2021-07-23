const userControllers=require('./controllers/user-controller');
const express = require('express');
const router=express.Router();
const {check}=require('express-validator');
const fileUpload=require('../middleware/file-upload');
const CheckAuth=require('../middleware/checkAuth');

router.get('/:email',userControllers.getUsers);
router.post('/signup',
    fileUpload.single('image'),
    [
    check('name').trim().not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({min:4})
],userControllers.userSignup);

router.post('/login', userControllers.userLogin);
//router.post();
module.exports=router;