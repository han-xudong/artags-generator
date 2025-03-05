// src/utils/dictLoader.js

// 全局字典对象
let dictCache = null;

/**
 * 加载标记字典
 * @returns {Promise} 返回一个Promise，在字典加载完成时resolve
 */
export const loadDict = async () => {
  if (dictCache !== null) {
    return dictCache;
  }
  
  try {
    const response = await fetch('/dict.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    dictCache = await response.json();
    return dictCache;
  } catch (error) {
    console.error('Error loading dictionary:', error);
    throw error;
  }
};
