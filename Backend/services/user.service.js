const User = require('../models/user.model'); // Import the User model
const {DeleteAllproductsSeller}=require('./products.sevice')
const mongoose = require('mongoose');

async function createUser(firstName, lastName, email, password, role) {
  try {
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      firstName,
      lastName,
      email,
      password,
      passwordConfirm:password,
      role 
    });
    const savedUser = await newUser.save();
    console.log('User created:', savedUser);
    const claims = {
        sub: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
    }
    return claims;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Read a user by email
async function getUserByEmail(email) {
  try {
    const user = await User.findOne({ email });
    console.log('User found:', user);
    return user;
  } catch (error) {
    console.error('Error finding user:', error);
    throw error;
  }
}

// Update a user's information
async function updateUser(id, updateData) {
  try {
    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    console.log('User updated:', updatedUser);
    return updatedUser;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Delete a user by ID
async function deleteUser(id) {
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    console.log('User deleted:', deletedUser);
    return deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}


// Get all users
async function getAllUsers() {
  try {
    const users = await User.find(); // Fetch all users from the database
    console.log('All users fetched:', users);
    return users;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

async function UpdateisActiveStatus(email,Status) {
  try{
    const user=await getUserByEmail(email);
    if(!user){
      throw new Error("user Not Found");
    }
    if(user.isActive!=Status){
      user.isActive=Status;
      await User.updateOne({ email }, { $set: { isActive: Status } });
      if(user.isActive==false){
        DeleteAllproductsSeller(id);
      }
      return { success: true, message: "Status updated successfully" };

    }else {
      console.log("Status is already set.");
      return { success: false, message: "No changes needed" };
    }

  }catch(error){
    console.log("error update is active status",error)
    throw error;
  }

}

async function getSpecificUsers(usersrole) {
    try{
        const Users= await User.find({role:usersrole});
        if(Users.length==0){
          return "There is no users with this  role"
        }
        return Users;
    }catch(error){
      throw new Error("Failed connect to database");
    }
}
async function getUserById(userid) {
  try{
    //console.log("service"+mongoose.Types.ObjectId(userid))
     const user=await User.findOne({_id:new mongoose.Types.ObjectId(userid)})
     return user;
  }catch(error){
    console.log("error from userservice");
    throw new Error("cant connect to DB"+error.message);
  }
  
  
}

module.exports = {
  createUser,
  getUserByEmail,
  updateUser,
  deleteUser,
  getAllUsers,
  UpdateisActiveStatus,
  getSpecificUsers,
  getUserById
};