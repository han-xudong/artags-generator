/**
 * Tag Generators - Utility for generating Aruco and AprilTag markers on canvas
 * This file provides functions to generate tag images on HTML canvas elements
 * The generated tags can be used for computer vision applications
 */

import { loadDict } from "./dictLoader";

/**
 * Generate Aruco tag on canvas
 * @param {HTMLCanvasElement} canvas - The canvas element to draw on
 * @param {string} dictionary - Type of Aruco dictionary
 * @param {number} id - Tag ID
 * @param {number} size - Size of the tag in millimeters
 * @param {number} dpi - Resolution in dots per inch
 * @param {number} margin - Margin around the tag in millimeters
 * @returns {HTMLCanvasElement} - The canvas with the generated tag
 */
export const generateArucoTag = async (
  canvas,
  dictionary,
  id,
  size,
  dpi,
  margin
) => {
  const dictData = await loadDict();
  
  console.log("Generate ArUco marker " + dictionary + " " + id);

  if (!dictData[dictionary] || !dictData[dictionary][id]) {
    throw new Error(`Dictionary ${dictionary} or ID ${id} not found`);
  }

  let markerBits;
  if (dictionary.includes("4X4")) markerBits = 4;
  else if (dictionary.includes("5X5")) markerBits = 5;
  else if (dictionary.includes("6X6")) markerBits = 6;
  else if (dictionary.includes("7X7")) markerBits = 7;
  else markerBits = 4;

  const bytes = dictData[dictionary][id];
  const bits = [];
  const bitsCount = markerBits * markerBits;

  for (const byte of bytes) {
    const start = bitsCount - bits.length;
    for (let i = Math.min(7, start - 1); i >= 0; i--) {
      bits.push((byte >> i) & 1);
    }
  }

  // Calculate canvas dimensions in pixels (converting from mm to pixels using DPI)
  // 25.4 is the number of mm in an inch
  canvas.width = (size + 2 * margin) * dpi / 25.4;
  canvas.height = (size + 2 * margin) * dpi / 25.4;
  const ctx = canvas.getContext("2d");

  // Fill canvas with white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Calculate size of each cell in pixels
  const cellSize = size * dpi / 25.4 / (markerBits + 2);

  // Draw the internal pattern of the marker
  // Loop through each cell in the internal grid (excluding border)
  for (let i = 1; i < markerBits + 1; i++) {
    for (let j = 1; j < markerBits + 1; j++) {
      const bitIndex = (i - 1) * markerBits + j - 1;
      const bit = bits[bitIndex] || 0;
      // Set color based on bit value (1 = white, 0 = black)
      ctx.fillStyle = bit ? "white" : "black";
      // Draw rectangle for this cell
      // Adding 1 pixel to width and height to avoid gaps between cells
      ctx.fillRect(
        margin * dpi / 25.4 + j * cellSize,
        margin * dpi / 25.4 + i * cellSize,
        cellSize + 1,
        cellSize + 1
      );
    }
  }
  // Draw the black border around the marker
  // This is a key feature of ArUco markers for detection
  for (let i = 0; i < markerBits + 2; i++) {
    for (let j = 0; j < markerBits + 2; j++) {
      // Only draw cells that are on the border
      if (i === 0 || i === markerBits + 1 || j === 0 || j === markerBits + 1) {
        ctx.fillStyle = "black";
        ctx.fillRect(
          margin * dpi / 25.4 + j * cellSize,
          margin * dpi / 25.4 + i * cellSize,
          cellSize + 1,
          cellSize + 1
        );
      }
    }
  }

  // Store tag metadata in the canvas object for later reference
  canvas.tagData = {
    tagType: "aruco",
    dictionary: dictionary,
    tagID: id,
    bits: bits,
    size: size,
    margin: margin
  };

  return canvas;
};

/**
 * Generate AprilTag on canvas
 * @param {HTMLCanvasElement} canvas - The canvas element to draw on
 * @param {string} family - Type of AprilTag family
 * @param {number} id - Tag ID
 * @param {number} size - Size of the tag in millimeters
 * @param {number} dpi - Resolution in dots per inch
 * @param {number} margin - Margin around the tag in millimeters
 * @returns {HTMLCanvasElement} - The canvas with the generated tag
 */
export const generateAprilTag = async (
  canvas,
  family,
  id,
  size,
  dpi,
  margin
) => {
  const dictData = await loadDict();

  console.log("Generate AprilTag " + family + " " + id);

  if (!dictData[family] || !dictData[family][id]) {
    throw new Error(`Family ${family} or ID ${id} not found`);
  }

  let gridSize;
  if (family === "tag16h5") {
    gridSize = 4;
  } else if (family === "tag25h9") {
    gridSize = 5;
  } else if (family === "tag36h10") {
    gridSize = 6;
  } else if (family === "tag36h11") {
    gridSize = 6;
  } else {
    gridSize = 4;
  }

  const fullGridSize = gridSize + 2;

  const bytes = dictData[family][id];
  const bits = [];
  const bitsCount = gridSize * gridSize;

  for (const byte of bytes) {
    const start = bitsCount - bits.length;
    for (let i = Math.min(7, start - 1); i >= 0; i--) {
      bits.push((byte >> i) & 1);
    }
  }

  // Calculate canvas dimensions in pixels (converting from mm to pixels using DPI)
  canvas.width = (size + 2 * margin) * dpi / 25.4;
  canvas.height = (size + 2 * margin) * dpi / 25.4;
  const ctx = canvas.getContext("2d");

  // Fill canvas with white background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Calculate size of each cell in pixels
  // For AprilTag, we use the full grid size including border
  const cellSize = size * dpi / 25.4 / fullGridSize;

  // Create a complete bit array including the border
  // AprilTags have a black border (0) around the data bits
  const fullBits = Array(fullGridSize * fullGridSize).fill(0);

  // Map the inner bits to the full grid with border
  for (let i = 0; i < fullGridSize; i++) {
    for (let j = 0; j < fullGridSize; j++) {
      if (
        i === 0 ||
        i === fullGridSize - 1 ||
        j === 0 ||
        j === fullGridSize - 1
      ) {
        // Border cells are always black (0)
        fullBits[i * fullGridSize + j] = 0;
      } else {
        // Map inner grid coordinates to the bit array
        const innerI = i - 1;
        const innerJ = j - 1;
        const innerIndex = innerI * gridSize + innerJ;
        fullBits[i * fullGridSize + j] = bits[innerIndex] || 0;
      }
    }
  }

  // Draw the complete AprilTag pattern including border
  for (let i = 0; i < fullGridSize; i++) {
    for (let j = 0; j < fullGridSize; j++) {
      const bitIndex = i * fullGridSize + j;
      const bit = fullBits[bitIndex] || 0;
      // Set color based on bit value (1 = white, 0 = black)
      ctx.fillStyle = bit ? "white" : "black";
      // Draw rectangle for this cell
      // Adding 1 pixel to width and height to avoid gaps between cells
      ctx.fillRect(
        margin * dpi / 25.4 + j * cellSize,
        margin * dpi / 25.4 + i * cellSize,
        cellSize + 1,
        cellSize + 1
      );
    }
  }

  // Store tag metadata in the canvas object for later reference
  canvas.tagData = {
    tagType: "apriltag",
    tagFamily: family,
    tagID: id,
    bits: fullBits,
    size: size,
    margin: margin
  };

  return canvas;
};
