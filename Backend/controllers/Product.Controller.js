const Inventory = require('../models/Inventory.model');
const Product = require('../models/product.model');


// Get products for a specific branch
exports.getProductsForBranch = async (req, res) => {
  try {
    const { branchId } = req.params;

    // Find the inventory document for the given branchId
    const inventory = await Inventory.findOne({ branchId })
      .populate({
        path: 'products.productId',
        model: 'Product',
        select: '-__v'
      });

    if (!inventory) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Extract and return the products with their details
    const products = inventory.products.map(product => ({
      productId: product.productId._id,
      name: product.productId.name,
      description: product.productId.description,
      price: product.productId.price,
      category: product.productId.category,
      stock: product.stock,
      isActive: product.productId.isActive,
      isBestSeller: product.productId.isBestSeller,
      salesCount: product.productId.salesCount
    }));

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a product to a specific branch's inventory
exports.addProductToBranch = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { productId, stock } = req.body;

    // Validate input
    if (!productId || !stock) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the inventory document for the given branchId
    const inventory = await Inventory.findOne({ branchId });

    if (!inventory) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Check if the product already exists in the branch's inventory
    const existingProduct = inventory.products.find(p => p.productId.toString() === productId);

    if (existingProduct) {
      return res.status(400).json({ message: 'Product already exists in this branch' });
    }

    // Add the product to the branch's inventory
    inventory.products.push({ productId, stock });
    await inventory.save();

    res.status(201).json({ message: 'Product added to branch inventory' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update the stock of a product in a specific branch
exports.updateProductInBranch = async (req, res) => {
  try {
    const { branchId, productId } = req.params;
    const { stock } = req.body;

    // Validate input
    if (!stock) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find the inventory document for the given branchId
    const inventory = await Inventory.findOne({ branchId });

    if (!inventory) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Find the product in the branch's inventory
    const productIndex = inventory.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in this branch' });
    }

    // Update the stock of the product
    inventory.products[productIndex].stock = stock;
    await inventory.save();

    res.status(200).json({ message: 'Product stock updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a product from a specific branch's inventory
exports.removeProductFromBranch = async (req, res) => {
  try {
    const { branchId, productId } = req.params;

    // Find the inventory document for the given branchId
    const inventory = await Inventory.findOne({ branchId });

    if (!inventory) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Find the product in the branch's inventory
    const productIndex = inventory.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found in this branch' });
    }

    // Remove the product from the branch's inventory
    inventory.products.splice(productIndex, 1);
    await inventory.save();

    res.status(200).json({ message: 'Product removed from branch inventory' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//////////////////////////////===========================MAIN ==================

// Get all products across all branches
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().select('-__v');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, images, stockQuantity, sellerinfo, isActive, isBestSeller, salesCount } = req.body;

    // Validate input
    if (!name || !description || !price || !category || !images || !stockQuantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Create the new product
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      images,
      stockQuantity,
      sellerinfo,
      isActive,
      isBestSeller,
      salesCount
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const updateData = req.body;

    // Validate input
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No data provided for update' });
    }

    // Find and update the product
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Find and delete the product
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};