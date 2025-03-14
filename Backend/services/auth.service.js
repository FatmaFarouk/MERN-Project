// const bcrypt = require('bcrypt');
// const jwtUtil = require('../utils/jwttoken.manager');
// const userService = require('../services/user.service');

// // Registration service
// async function registerUser(firstName, lastName, email, password, role) {
//     try {
//         const existingUser = await userService.getUserByEmail(email);
//         if (existingUser) {
//             throw new Error('Email already exists');
//         }

//         const claims = await userService.createUser(firstName, lastName, email, password, role || 'customer');
        
//         // Generate JWT token
//         const token = jwtUtil.signToken({ claims });
//         return { user: claims, token };
//     } catch (error) {
//         console.error('Error registering user:', error);
//         throw error;
//     }
// }

// // Login service
// async function loginUser(email, password) {
//     try {
//         const user = await userService.getUserByEmail(email);
//         if (!user) {
//             throw new Error('Invalid email or password');
//         }

//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             throw new Error('Invalid email or password');
//         }

//         const claims = {
//             sub: user._id,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             email: user.email,     
//             role: user.role,
//         };

//         // Generate JWT token
//         const token = jwtUtil.signToken({ claims });
//         return { user: claims, token };
//     } catch (error) {
//         console.error('Error logging in user:', error);
//         throw error;
//     }
// }

// module.exports = {
//     registerUser,
//     loginUser
// };