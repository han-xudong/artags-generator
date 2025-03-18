/**
 * Dictionary Loader - Utility for loading tag dictionaries
 * This file provides functions to load and cache dictionary data for Aruco and AprilTag markers
 */

// Global dictionary cache to avoid repeated fetching
let dictCache = null;

/**
 * Load tag dictionary from JSON file
 * This function implements a singleton pattern to cache dictionary data
 * @returns {Promise<Object>} - Promise that resolves with the dictionary data containing all tag definitions
 */
export const loadDict = async () => {
  // Return cached dictionary if already loaded
  if (dictCache !== null) {
    return dictCache;
  }
  
  try {
    // Fetch dictionary data from JSON file
    const response = await fetch('dict.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // Parse and cache the dictionary data
    dictCache = await response.json();
    return dictCache;
  } catch (error) {
    console.error('Error loading dictionary:', error);
    throw error;
  }
};
