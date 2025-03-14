const ImageKit=require('../utils/imageKit.util');

const upload = async (images) => {
    try {
      const uploadPromises = images.map((img) =>
        ImageKit.upload({
          file: img.data, // For express-fileupload
          fileName: img.name,
          folder: "/products",
        })
      );
  
      const uploadedImages = await Promise.all(uploadPromises);
      return uploadedImages.map((img) => img.url);
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
};

module.exports = { upload };