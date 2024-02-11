const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require('../model/userModel');

// Register User
// (POST)
const registerUser = asyncHandler(async (req, res)=>{
    const {username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!");
    }
    const userAvailable = await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("User already registered!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Password:", hashedPassword);
    const user = await User.create({
        username,
        email,
        password: hashedPassword,
    });
    console.log(`User Created ${user}`);
    if(user){
        res.status(201).json({_id: user._id, email: user.email})
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({ message: "Register the user" });
});

// Login User
// (POST)
const loginUser = asyncHandler(async (req, res)=>{

    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!")
    }

    const user = await User.findOne({email});
    // Password comparison of entered and already registered
    if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user._id,
            },
        }, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: "2d"}
        );
        res.status(200).json({ accessToken, id: user._id, });
    }else{
        res.status(401);
        throw new Error("Email or Password is not valid");
    }

});

// Register User
// (GET)
const currentUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Find the user by ID
    const user = await User.findById(userId);

    if (user) {
        // Return the user data including the profile picture
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture // Include the profile picture
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

//Update user Information (PUT)
const updateCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
    }
    if (req.body.username) {
        user.username = req.body.username;
    }
    if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
    }
    if (req.file) {
        user.profilePicture = req.file.filename;
    }
    await user.save();
    res.status(200).json({ message: "User updated successfully", user }); 
});


module.exports = { registerUser, loginUser, currentUser, updateCurrentUser }