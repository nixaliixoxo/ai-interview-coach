// frontend se data layenge
// post ke req body mein data hoga
// then user create krvayenge database mein
// token bhi create krvayenge aur usse cookies mein store krva denge
// uss token ke andaruser ki id bhi dalenge
// jab bhi check krna hoga kaunsa user authenticated hai toh hum uss samay token mein se user id ko find krlenge

import genToken from "../config/token.js";
import User from "../models/user.model.js"

export const googleAuth = async(req, res) => {
    try{
        const {name, email} = req.body;
        let user = await User.findOne({email});
        if(!user){
            user = await User.create({
                name, 
                email
            });
        }
        let token = await genToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7*24*60*60*1000
        });
        return res.status(200).json(user);
    }
    catch(error){
        return res.status(500).json({message: `Google Auth error ${error}`});
    }
} 

export const logOut = async(req, res) => {
    try{
        await res.clearCookie("token");
        return res.status(200).json({message: "Logout successful"});
    }
    catch(error){
        return res.status(500).json({message: `Logout error ${error}`});
    }
}