const express = require('express');
const bcrypt = require('bcrypt');
const user = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const multer = require('multer');
const fs = require('fs');
const JWT_SECRET = "thisiswebtokensecret";

var jwt = require('jsonwebtoken');

//Saving the image
const storage = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null, 'uploads')
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now() + file.originalname)
    }
})

const upload = multer({storage:storage})
//Creating a user using POST /api/auth/signup request.
// router.post('/signup', [
//     body('email', 'Please Enter valid email').isEmail(),
//     body('password', 'Password must be lenght of 5 characters').isLength({ min: 5 }),
// ], async (req, res) => {
//     let success = false;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }
//     try {
//         let exist = await user.findOne({ email: req.body.email });
//         if (exist) {
//             return res.status(400).json({success,  error: "Sorry a user with this email already exists" });
//         }
//         const salt = await bcrypt.genSalt(10);
//         const secPass = await bcrypt.hash(req.body.password, salt);
//         let newuser = await user.create({
//             name: req.body.name,
//             email: req.body.email,
//             password: secPass,
//         });
//         const data = {
//             user: {
//                 id: newuser._id
//             }
//         }
//         success = true
//         const token = jwt.sign(data, JWT_SECRET);
//         res.send({success, token});
//     } catch (error) {
//         res.status(500).send("Internal Server Error Occurred. Please Try Again.")
//     }
// })

router.post('/signup', upload.single('upload-image'), (req, res)=>{
    const newUser = new user({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        image:{
            data:fs.readFileSync('uploads/' + req.file.filename),
            contentType:'image/png'
        }
    })
    newUser.save()
    .then(()=>{console.log('Image Uplaoded')})
    .catch((err)=>{console.log(err)});
})

//Route 2: Authenticate a user using POST using "/api/auth/login"
router.post('/login', [
    body('email', 'Enter a Valid Email').isEmail(),
    body('password', 'Password cannot be blank').exists()
] , async (req, res)=>{
    let success = false;
    //Is there are errors return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()});
    }
    //Req.body contains email and password so extracting them
    const {email, password} = req.body;
    try {
        let loggedinuser = await user.findOne({email})
        if(!loggedinuser){
            return res.status(400).json({success, error:"Pleasee try to login with correct credentials"})
        }
        // const passwordCompare = await bcrypt.compare(password, loggedinuser.password)
        // if(!passwordCompare){
        //    return res.status(400).json({success, error:"Please try to login with correct credentials"})
        // }
        //it is the data of user.... We will send the id of user
        const data = {
            user:{
                id:loggedinuser._id
            }
        }
        success = true;
        const token  = jwt.sign(data, JWT_SECRET);
        const image = loggedinuser.image;
        const name = loggedinuser.name;
        res.json({success, token, name, image});
    }catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

// Route 3: Get user details using POST using "/api/auth/getuser"
router.post('/getuser', fetchuser , async (req, res)=>{
    try {
        const userID = req.User.id;
        const loggedinuser = await user.findOne({userID}).select("-password")
        res.send(loggedinuser);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error occurred");
    }
})

module.exports = router