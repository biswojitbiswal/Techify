const adminVerify = async(req, res, next) => {
    try {
        const admin = await req.user.isAdmin;

        if(!admin){
            return res.status(403).json({message: "Access Denied!"})
        }
        next();
    } catch (error) {
        return res.status(500).json({message: "Something Went Wrong!"})
    }
}

export default adminVerify;
