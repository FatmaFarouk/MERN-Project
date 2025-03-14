// const Permission = require('../models/Permission');

// // Cache permissions for better performance
// let permissionCache = [];

// const refreshPermissionCache = async () => {
//   try {
//     permissionCache = await Permission.find().lean();
//     console.log('Permission cache refreshed');
//   } catch (err) {
//     console.error('Permission cache refresh failed:', err);
//   }
// };

// // Initialize cache on startup
// refreshPermissionCache();

// // RBAC Authorization Middleware
// const authorize = (resource, action) => {
//   return async (req, res, next) => {
//     try {
//       // 1. Get user roles from request (assumes authentication is already handled)
//       const userRoles = req.user?.roles || [];
      
//       // 2. Find relevant permissions
//       const relevantPermissions = permissionCache.filter(perm => {
//         const resourceMatch = perm.resource === resource || perm.resource === '*';
//         const actionMatch = perm.action === action || 
//                           (Array.isArray(perm.action) && perm.action.includes(action)) || 
//                           perm.action === '*';
//         return resourceMatch && actionMatch;
//       });

//       // 3. Evaluate permissions
//       let isAllowed = false;
//       for (const perm of relevantPermissions) {
//         const { IN: allowedRoles, NIN: deniedRoles } = perm.condition.role;
        
//         // Check role exclusions first
//         const hasDeniedRole = userRoles.some(role => deniedRoles.includes(role));
//         if (hasDeniedRole) continue;

//         // Check role inclusions
//         const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));
        
//         if (hasAllowedRole) {
//           if (perm.effect === 'allow') isAllowed = true;
//           if (perm.effect === 'deny') {
//             isAllowed = false;
//             break; // Explicit deny takes precedence
//           }
//         }
//       }

//       if (!isAllowed) {
//         return res.status(403).json({
//           success: false,
//           message: 'Insufficient permissions to access this resource'
//         });
//       }

//       next();
//     } catch (err) {
//       console.error('Authorization error:', err);
//       res.status(500).json({ success: false, message: 'Authorization check failed' });
//     }
//   };
// };

// // Middleware to refresh permission cache
// const refreshPermissions = async (req, res, next) => {
//   await refreshPermissionCache();
//   next();
// };

// module.exports = {
//   authorize,
//   refreshPermissions
// };