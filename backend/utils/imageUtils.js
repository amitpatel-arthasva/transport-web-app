const fs = require('fs');
const path = require('path');

/**
 * Convert an image file to base64 data URL
 * @param {string} imagePath - Path to the image file relative to assets/images
 * @returns {string} - Base64 data URL or empty string if file not found
 */
const getImageAsBase64 = (imagePath) => {
  try {
    const fullPath = path.join(__dirname, '..', 'assets', 'images', imagePath);
    
    if (!fs.existsSync(fullPath)) {
      console.warn(`Image not found: ${fullPath}`);
      return '';
    }
    
    const imageBuffer = fs.readFileSync(fullPath);
    const extension = path.extname(imagePath).toLowerCase();
    
    // Determine MIME type based on extension
    let mimeType = 'image/jpeg'; // default
    switch (extension) {
      case '.png':
        mimeType = 'image/png';
        break;
      case '.jpg':
      case '.jpeg':
        mimeType = 'image/jpeg';
        break;
      case '.gif':
        mimeType = 'image/gif';
        break;
      case '.webp':
        mimeType = 'image/webp';
        break;
      case '.svg':
        mimeType = 'image/svg+xml';
        break;
    }
    
    const base64String = imageBuffer.toString('base64');
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    console.error(`Error converting image to base64: ${imagePath}`, error);
    return '';
  }
};

/**
 * Get all logo images as base64 data URLs
 * @returns {Object} - Object with logo names as keys and base64 data URLs as values
 */
const getLogosAsBase64 = () => {
  return {
    truckLogo: getImageAsBase64('truck_LR.webp'),
    companyLogo: getImageAsBase64('dattaguru_invoice.webp')
  };
};

module.exports = {
  getImageAsBase64,
  getLogosAsBase64
};
