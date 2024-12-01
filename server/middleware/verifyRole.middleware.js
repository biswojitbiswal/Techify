const verifyRole = (roles) => {
    return async(req, res, next) => {
        try {
            if(!req.user || !roles.includes(req.user.role)){
                return res.status(403).json({message: "Access Denied"});
            }
            next();
        } catch (error) {
            return res.status(500).json({message: "Something Went Wrong!"})
        }
    }  
}

export default verifyRole;
