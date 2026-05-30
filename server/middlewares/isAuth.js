import jwt from "jsonwebtoken";

const isAuth = async(req, res, next) => {
    try{
        //console.log("reached isauth");
        let {token} = req.cookies;
        //console.log("token:", token);
        //console.log("secret:", process.env.JWT_SECRET);
        if(!token){
            return res.status(400).json({message: "user token does not exist"});
        }
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!verifyToken){
            return res.status(400).json({message: "user does not have a valid token"});
        }
        //console.log("verifyToken", verifyToken);
        req.userId = verifyToken.userId;
        //console.log("req.userId", req.userId);
        next();
    }
    catch(error){
        console.log("JWT ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

export default isAuth;