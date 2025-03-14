// const PermissionModel = require('../models/permission.model');

// async function createPermission(effect, resource, action, description, condition) {
//     try {
//         const newPermission = new Permission({
//             effect,
//             resource,
//             action,
//             description,
//             condition,
//         });
//         const savedPermission = await newPermission.save();
//         console.log('Permission created:', savedPermission);
//         return savedPermission;
//     } catch (error) {
//         console.error('Error creating permission:', error);
//         throw error;
//     }
// }

// // Get all permissions
// async function getAllPermissions() {
//     try {
//         const permissions = await Permission.find();
//         console.log('Permissions found:', permissions);
//         return permissions;
//     } catch (error) {
//         console.error('Error finding permissions:', error);
//         throw error;
//     }
// }

// // Get a permission by ID
// async function getPermissionById(id) {
//     try {
//         const permission = await Permission.findById(id);
//         if (!permission) {
//             console.log('Permission not found');
//             return null;
//         }
//         console.log('Permission found:', permission);
//         return permission;
//     } catch (error) {
//         console.error('Error finding permission:', error);
//         throw error;
//     }
// }

// // Update a permission's information
// async function updatePermission(id, updateData) {
//     try {
//         const updatedPermission = await Permission.findByIdAndUpdate(id, updateData, { new: true });
//         if (!updatedPermission) {
//             console.log('Permission not found');
//             return null;
//         }
//         console.log('Permission updated:', updatedPermission);
//         return updatedPermission;
//     } catch (error) {
//         console.error('Error updating permission:', error);
//         throw error;
//     }
// }

// // Delete a permission by ID
// async function deletePermission(id) {
//     try {
//         const deletedPermission = await Permission.findByIdAndDelete(id);
//         if (!deletedPermission) {
//             console.log('Permission not found');
//             return null;
//         }
//         console.log('Permission deleted:', deletedPermission);
//         return deletedPermission;
//     } catch (error) {
//         console.error('Error deleting permission:', error);
//         throw error;
//     }
// }

// // Get permissions by resource name
// async function getPermissionsByResource(resource) {
//     try {
//         const permissions = await Permission.find({ resource });
//         console.log('Permissions found for resource:', resource, permissions);
//         return permissions;
//     } catch (error) {
//         console.error('Error finding permissions by resource:', error);
//         throw error;
//     }
// }

// module.exports = {
//     createPermission,
//     getAllPermissions,
//     getPermissionById,
//     updatePermission,
//     deletePermission,
//     getPermissionsByResource
// };