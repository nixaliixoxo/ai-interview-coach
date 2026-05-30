import User from "../models/user.model.js";


export const getCurrentUser = async(req, res) => {
    //console.log("reached getcurruser");
    try{
        const userId = req.userId;
        //console.log("controller userId", userId);
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: "user not found"});
        }
        return res.status(200).json(user);
    }
    catch(error){
        return res.status(500).json({message: `failed to get current user error ${error}`});
    }
}
