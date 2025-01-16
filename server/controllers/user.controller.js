import { User } from "../models/user.model.js";


const generateAccessToken = async(userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        const accessToken = await user.generateToken();

        return {accessToken}
    } catch (error) {
        throw new Error("Something Went Wrong While Generating Access Token");
    }
}

const registerUser = async(req, res, next) => {
    try {
        const {name, email, phone, password} = req.body;
    
        if([name, email, phone, password].some((field) => field?.trim() === "")){
            return res.status(400).json({message: "All Fields are Required!"})
        }

        if (!email || email.indexOf('@') === -1 || email.indexOf('.') === -1 || 
            email.indexOf('@') === 0 || email.indexOf('.') === email.length - 1 || 
            email.indexOf('@') > email.indexOf('.')) {
            return res.status(400).json({ message: "Fill Correct Email" });
        }
    
        const userExist = await User.findOne({email});
    
        if(userExist){
            return res.status(409).json({message: "User Already Exist"});
        }
    
        const user = await User.create({
            name,
            email,
            phone,
            password,
        })
    
        const createdUser = await User.findById(user._id).select("-password");
    
        if(!createdUser){
            return res.status(404).json({message: "user not Found!"});
        }
    
        const {accessToken} = await generateAccessToken(createdUser._id);
    
        return res.status(201).json({
            message: "User Register Successfully",
            user: createdUser,
            userId: createdUser._id,
            token: accessToken,
        })
    } catch (error) {
        next(error);
    }
}

const loginUser = async(req, res, next) => {
    try {
        const {email, password} = req.body;

        if(!email || email.includes('@') === -1 || !email.includes('.') === -1 || email.indexOf('@') > email.indexOf('.')){
            return res.status(400).json({message: "Give Correct Email"});
        }

        if(!password || password.length < 8){
            return res.status(400).json({message: "Password Should Be More Than 8 Character"})
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(404).json({message: "User Does Not Exist"});
        }

        console.log("Checking Password...");
        const isValidPassword = await user.isPasswordCorrect(password);
        console.log("Password Validation Result:", isValidPassword);

        if(!isValidPassword){
            return res.status(401).json({message: "Invalid User Authentication"})
        }

        const {accessToken} = await generateAccessToken(user._id);

        const loggedinuser = await User.findById(user._id).select("-password");



        return res.status(200).json({
            message: "User Login Successfully",
            user: loggedinuser,
            token: accessToken,
            userId: loggedinuser._id
        })
    } catch (error) {
        next(error);
    }
}

const authnticateWithGoogle = async(req, res, next) => {
    try {
        const {name, email, phone} = req.body;

        if([name, email, phone].some((field) => field?.trim() === "")){
            return res.status(400).json({message: "All Fields are Required!"})
        }

        const userExist = await User.findOne({email});

        if(userExist){
            const {accessToken} = await generateAccessToken(userExist._id);

            const loginUser = await User.findById(userExist._id).select("-password -cart");

            return res.status(200).json({
                message: "User Login Successfully",
                user: loginUser,
                userId: loginUser._id,
                token: accessToken,
            });
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

            const newUser = await User.create({
                name,
                email,
                phone,
                password: generatedPassword,
            }).select("-password -cart");

            if (!newUser) {
                return res
                  .status(500)
                  .json({ message: "Something went wrong while registering user" });
            }

            const {accessToken} = await generateAccessToken(newUser._id);

            return res.status(200).json({
                message: "User Registered Successfully",
                user: newUser,
                userId: newUser._id.toString(),
                token: accessToken,
              });
        }
    } catch (error) {
        next(error);
    }
}

const getCurrUser = async(req, res, next) => {
    try {
        const user = req.user;
        // console.log(req.user);

        if(!user) {
            return res.status(404).json({message: "Something Went Wrong"})
        }

        return res.status(200).json({
            message: "User Fetched Successfully", 
            userData : user,
        })
    } catch (error) {
        next(error);
    }
}

const addAddresses = async(req, res, next) => {
    try {
        const {orderByName, contact, street, city, state, zipcode, type} = req.body;
        

        if([orderByName, contact, street, city, state, zipcode, type].some((field) => field?.trim() === "")){
            return res.status(401).json({message: "All Fields Required"});
        }

        const user = await User.findById(req.userId);

        if(!user){
            return res.status(404).json({message: "User Not Found"});
        }

        const newAddress = {
            orderByName,
            contact,
            street,
            city,
            state,
            zipcode,
            type,
        }

        if(user.addresses.length > 0){
            user.addresses.forEach((address) => (address.isPrimary = false));
        }
        user.addresses.push(newAddress);
        await user.save();

        return res.status(200).json({
            message: "Address Added Successfully"
        });
    } catch (error) {
        next(error);
    }
}

const deleteAddressById = async(req, res, next) => {
    try {
        const { addressId } = req.params;

        const user = await User.findById(req.userId);

        if(!user){
            return res.status(404).json({message: "User Not Found"});
        }
        
        const address = user.addresses.find((addr) => addr._id.toString() === addressId);

        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            {$pull: {addresses: {_id: addressId}}},
            {new: true}
        )

        const addrExists = !updatedUser.addresses.some((addr) => addr._id.toString() === addressId);

        if(!addrExists){
            return res.status(404).json({message: "Address Not Found or Already Removed"});
        }

        if(address.isPrimary === true && updatedUser.addresses.length > 0){
            updatedUser.addresses[0].isPrimary = true;
            await updatedUser.save();
        }
        
        return res.status(200).json({message: "Address Deleted Successfull"});
    } catch (error) {
        next(error);
    }
}

const updateAddress = async (req, res, next) => {
    
    try {
        const { addressId } = req.params;
        const updatedAddress = req.body;

        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const addressIndex = user.addresses.findIndex(address => address._id.toString() === addressId);
        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Address not found' });
        }

        user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...updatedAddress };
        await user.save();

        res.status(200).json({ message: 'Address updated successfully', addresses: user.addresses });
    } catch (error) {
        next(error);
    }
};


const handlePrimaryAddress = async(req, res, next) => {
    try {
        const { addressId } = req.params;

        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Reset all addresses' primary field to false
        user.addresses.forEach((address) => (address.isPrimary = false));

        // Set the selected address as primary
        const address = user.addresses.find((addr) => addr._id.toString() === addressId);
        if (!address) return res.status(404).json({ message: 'Address not found' });

        address.isPrimary = true;

        await user.save();
        res.status(200).json({ message: 'Primary address updated successfully', addresses: user.addresses });
    } catch (error) {
        next(error);
    }
};


export {
    registerUser,
    loginUser,
    authnticateWithGoogle,
    getCurrUser,
    addAddresses,
    deleteAddressById,
    updateAddress,
    handlePrimaryAddress
}