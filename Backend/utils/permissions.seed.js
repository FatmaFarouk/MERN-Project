// const mongoose = require('mongoose');
// const Permission = require('./models/Permission');

// const permissions = [
//   // Super Admin/Manager Permissions
//   {
//     effect: 'allow',
//     resource: '*',
//     action: '*',
//     description: 'Full system access',
//     condition: {
//       role: {
//         IN: ['super_admin', 'manager'],
//         NIN: []
//       }
//     }
//   },

//   // Seller Permissions
//   {
//     effect: 'allow',
//     resource: 'products',
//     action: ['create', 'read', 'update', 'delete'],
//     description: 'Manage product listings',
//     condition: {
//       role: {
//         IN: ['seller'],
//         NIN: []
//       }
//     }
//   },

//   // Customer Permissions
//   {
//     effect: 'allow',
//     resource: 'cart',
//     action: ['create', 'read', 'update', 'delete'],
//     description: 'Shopping cart management',
//     condition: {
//       role: {
//         IN: ['customer'],
//         NIN: []
//       }
//     }
//   },

//   // Cashier Permissions
//   {
//     effect: 'allow',
//     resource: 'transactions',
//     action: ['create', 'read', 'refund'],
//     description: 'Process payments and refunds',
//     condition: {
//       role: {
//         IN: ['cashier'],
//         NIN: []
//       }
//     }
//   },

//   // Sales Clerk Permissions
//   {
//     effect: 'allow',
//     resource: 'orders',
//     action: ['create', 'read', 'update'],
//     description: 'Manage customer orders',
//     condition: {
//       role: {
//         IN: ['sales_clerk'],
//         NIN: []
//       }
//     }
//   },

//   // Inventory Management
//   {
//     effect: 'allow',
//     resource: 'inventory',
//     action: ['read', 'update'],
//     description: 'View and update stock levels',
//     condition: {
//       role: {
//         IN: ['manager', 'sales_clerk'],
//         NIN: []
//       }
//     }
//   }
// ];

// async function seedPermissions() {
//   await mongoose.connect('mongodb://localhost:27017/ecom-db');
  
//   // Clear existing permissions
//   await Permission.deleteMany();
  
//   // Insert new permissions
//   await Permission.insertMany(permissions);
  
//   console.log('✅ Permissions seeded successfully');
//   process.exit();
// }

// seedPermissions().catch(err => {
//   console.error('❌ Seeding failed:', err);
//   process.exit(1);
// });