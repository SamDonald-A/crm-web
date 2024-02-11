const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

// const validateToken = asyncHandler(async(req,res,next)=>{
//     let token;

//     let authHeader = req.headers.Authorization || req.headers.authorization;
//     if (authHeader && authHeader.startsWith("Bearer")){
//         token = authHeader.split(" ")[1];
//         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
//             if(err){
//                 return res.status(401).send({ error: "User is not authorized!" });
//             }
//             req.user = decoded.user;
//             next();
//         });

//         if(!token){
//             return res.status(401).send({ error: "User is Not authorized or Token Missing" });
//         }
//     }
// })

const validateToken = asyncHandler(async (req, res, next) => {
    let token;

    let authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({ error: "User is not authorized!" });
            }
            req.user = decoded.user;
            next();
        });
    } else {
        return res.status(401).send({ error: "User is Not authorized or Token Missing" });
    }
});


module.exports = validateToken;