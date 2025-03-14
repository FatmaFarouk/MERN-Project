// const jwtUtil = require('../utils/jwttoken.manager');
// const userService = require('../services/user.service');

// async function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ message: 'Access token is missing or invalid' });
//     }

//     try {
//         const claims = jwtUtil.verifyToken(token);
//         const user = await userService.getUserByEmail(claims.email);

//         if (!user) {
//             return res.status(403).json({ message: 'User not found' });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.error('Error authenticating token:', error);
//         return res.status(403).json({ message: 'Invalid token' });
//     }
// }

// module.exports = {
//     authenticateToken
// };