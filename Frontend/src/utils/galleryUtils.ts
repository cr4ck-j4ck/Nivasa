/**
 * Utility functions for handling gallery images
 */

/**
 * Get the first image from a gallery object
 * @param gallery - Gallery object with string keys and string array values
 * @returns First available image URL or placeholder
 */
export const getFirstImageFromGallery = (gallery: Record<string, string[]> | undefined | null): string => {
  if (!gallery || typeof gallery !== 'object') {
    return '/Nivasa_Banner.png';
  }
  
  // Get all image arrays from the gallery
  const imageArrays = Object.values(gallery);
  
  // Find the first non-empty array and return its first image
  for (const imageArray of imageArrays) {
    if (Array.isArray(imageArray) && imageArray.length > 0) {
      return imageArray[0];
    }
  }
  
  return '/Nivasa_Banner.png';
};

/**
 * Get all images from a gallery object as a flat array
 * @param gallery - Gallery object with string keys and string array values
 * @returns Array of all image URLs
 */
export const getAllImagesFromGallery = (gallery: Record<string, string[]> | undefined | null): string[] => {
  if (!gallery || typeof gallery !== 'object') {
    return [];
  }
  
  const allImages: string[] = [];
  const imageArrays = Object.values(gallery);
  
  for (const imageArray of imageArrays) {
    if (Array.isArray(imageArray)) {
      allImages.push(...imageArray);
    }
  }
  
  return allImages;
};

/**
 * Get images from a specific category in the gallery
 * @param gallery - Gallery object with string keys and string array values
 * @param category - Category key to get images from
 * @returns Array of image URLs from the specified category
 */
export const getImagesFromCategory = (
  gallery: Record<string, string[]> | undefined | null, 
  category: string
): string[] => {
  if (!gallery || typeof gallery !== 'object' || !gallery[category]) {
    return [];
  }
  
  return Array.isArray(gallery[category]) ? gallery[category] : [];
};

/**
 * Get the total count of images in a gallery
 * @param gallery - Gallery object with string keys and string array values
 * @returns Total number of images
 */
export const getGalleryImageCount = (gallery: Record<string, string[]> | undefined | null): number => {
  if (!gallery || typeof gallery !== 'object') {
    return 0;
  }
  
  let count = 0;
  const imageArrays = Object.values(gallery);
  
  for (const imageArray of imageArrays) {
    if (Array.isArray(imageArray)) {
      count += imageArray.length;
    }
  }
  
  return count;
};