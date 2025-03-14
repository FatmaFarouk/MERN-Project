const userService = require('../services/user.service');

//create a new user
async function createUserController(req, res) {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const user = await userService.createUser(firstName, lastName, email, password, role);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error in createUserController:', error);
    res.status(500).json({ message: error.message });
  }
}

//get a user by email
async function getUserByEmailController(req, res) {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getUserByEmailController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

//update a user
async function updateUserController(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const user = await userService.updateUser(id, updateData);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in updateUserController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

//delete a user
async function deleteUserController(req, res) {
  try {
    const { id } = req.params;
    const user = await userService.deleteUser(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error in deleteUserController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


// Get all users
async function getAllUsersController(req, res) {
  try {
    const users = await userService.getAllUsers();
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsersController:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function UpdateisActiveStatusController(req,res) {
  try{
     const email=req.params;
     const status=req.body;
     const ismodified= await userService.UpdateisActiveStatusController(email,status);
     if(ismodified){
       return res.status(200).json({message:"isActive Status Update Succesfully"})
     }
      res.status(400).json(ismodified);

  }catch(error){
    console.error("Error in UpdateisActiveStatusController:" ,error);
    res.status(500).json({message:"interval server error"})
  }
}

async function getUsersSpecificRole(req,res){
  try{
    const role=req.params.role;
    if (!role || typeof role !== 'string') {
      return res.status(400).json({ message: "Invalid or missing role parameter" });
  }
    const Users=await userService.getSpecificUsers(role)
    res.status(200).json(Users)
  }catch(error){
    res.status(500).json({message:error.message})
  }
}

async function getuserById(req,res) {
  try{
    const {id}=req.body;
    // console.log(id);
    const user=await userService.getUserById(id);
    if(!user){
      res.status(400).json({message:"invalid id"});
    }
    res.status(200).json(user);
  }catch(error){
    res.status(500).json({message:error.message})
  }
  
}
module.exports = {
  createUserController,
  getUserByEmailController,
  updateUserController,

  deleteUserController,
  getAllUsersController,
  UpdateisActiveStatusController,
  getUsersSpecificRole,
  getuserById
};

