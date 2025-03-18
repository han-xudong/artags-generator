/**
 * SVG Tag Generators - For generating vector graphics of Aruco and AprilTag markers
 * This file provides functions to generate SVG format tags that maintain clarity at any size
 */

import { loadDict } from "./dictLoader";

/**
 * Generate SVG element for Aruco tag
 * @param {string} dictionary - Type of Aruco dictionary
 * @param {number} id - Tag ID
 * @param {number} size - Tag size in millimeters
 * @param {number} margin - Margin around the tag in millimeters
 * @returns {SVGElement} - The generated SVG element
 */
export const generateArucoTagSVG = async (dictionary, id, size, margin) => {
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

  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const totalSize = size + 2 * margin;
  svg.setAttribute("width", totalSize + "mm");
  svg.setAttribute("height", totalSize + "mm");
  
  // Calculate viewBox to keep tag size fixed and margin as extra space
  const tagViewBoxSize = markerBits + 2; // Size of the tag itself (including black border)
  const viewBoxSize = tagViewBoxSize + (margin / size) * tagViewBoxSize * 2; // Total viewBox size after adding margins
  const marginInViewBox = (margin / size) * tagViewBoxSize; // Margin size in viewBox units
  
  svg.setAttribute("viewBox", `0 0 ${viewBoxSize} ${viewBoxSize}`);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  
  // Add background (for the entire SVG)
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("x", 0);
  background.setAttribute("y", 0);
  background.setAttribute("width", viewBoxSize);
  background.setAttribute("height", viewBoxSize);
  background.setAttribute("fill", "white");
  svg.appendChild(background);

  // Create a group to contain tag content and center it
  const tagGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  // Move tag group to correct position (considering margin)
  tagGroup.setAttribute("transform", `translate(${marginInViewBox}, ${marginInViewBox})`);
  svg.appendChild(tagGroup);
  
  // Add border
  for (let i = 0; i < markerBits + 2; i++) {
    for (let j = 0; j < markerBits + 2; j++) {
      if (i === 0 || i === markerBits + 1 || j === 0 || j === markerBits + 1) {
        const cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cell.setAttribute("x", j - 0.01);
        cell.setAttribute("y", i - 0.01);
        cell.setAttribute("width", 1.02);
        cell.setAttribute("height", 1.02);
        cell.setAttribute("fill", "black");
        tagGroup.appendChild(cell);
      }
    }
  }

  // Add internal bitmap
  for (let i = 1; i < markerBits + 1; i++) {
    for (let j = 1; j < markerBits + 1; j++) {
      const bitIndex = (i - 1) * markerBits + j - 1;
      const bit = bits[bitIndex] || 0;
      if (bit === 0) { // Only add black squares, white is background
        const cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cell.setAttribute("x", j - 0.01);
        cell.setAttribute("y", i - 0.01);
        cell.setAttribute("width", 1.02);
        cell.setAttribute("height", 1.02);
        cell.setAttribute("fill", "black");
        tagGroup.appendChild(cell);
      }
    }
  }

  // Add tag metadata
  svg.tagData = {
    tagType: "aruco",
    dictionary: dictionary,
    tagID: id,
    bits: bits,
    size: size,
    margin: margin
  };

  return svg;
};

/**
 * Generate SVG element for AprilTag
 * @param {string} family - Type of AprilTag family
 * @param {number} id - Tag ID
 * @param {number} size - Tag size in millimeters
 * @param {number} margin - Margin around the tag in millimeters
 * @returns {SVGElement} - The generated SVG element
 */
export const generateAprilTagSVG = async (family, id, size, margin) => {
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

  // Create complete bitmap array
  const fullBits = Array(fullGridSize * fullGridSize).fill(0);

  for (let i = 0; i < fullGridSize; i++) {
    for (let j = 0; j < fullGridSize; j++) {
      if (
        i === 0 ||
        i === fullGridSize - 1 ||
        j === 0 ||
        j === fullGridSize - 1
      ) {
        fullBits[i * fullGridSize + j] = 0;
      } else {
        const innerI = i - 1;
        const innerJ = j - 1;
        const innerIndex = innerI * gridSize + innerJ;
        fullBits[i * fullGridSize + j] = bits[innerIndex] || 0;
      }
    }
  }

  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  const totalSize = size + 2 * margin;
  svg.setAttribute("width", totalSize + "mm");
  svg.setAttribute("height", totalSize + "mm");
  
  // Calculate viewBox to keep tag size fixed and margin as extra space
  const tagViewBoxSize = fullGridSize; // Size of the tag itself
  const viewBoxSize = tagViewBoxSize + (margin / size) * tagViewBoxSize * 2; // Total viewBox size after adding margins
  const marginInViewBox = (margin / size) * tagViewBoxSize; // Margin size in viewBox units
  
  svg.setAttribute("viewBox", `0 0 ${viewBoxSize} ${viewBoxSize}`);
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  
  // Add background (for the entire SVG)
  const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  background.setAttribute("x", 0);
  background.setAttribute("y", 0);
  background.setAttribute("width", viewBoxSize);
  background.setAttribute("height", viewBoxSize);
  background.setAttribute("fill", "white");
  svg.appendChild(background);

  // Create a group to contain tag content and center it
  const tagGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
  // Move tag group to correct position (considering margin)
  tagGroup.setAttribute("transform", `translate(${marginInViewBox}, ${marginInViewBox})`);
  svg.appendChild(tagGroup);
  
  // Add bitmap
  for (let i = 0; i < fullGridSize; i++) {
    for (let j = 0; j < fullGridSize; j++) {
      const bitIndex = i * fullGridSize + j;
      const bit = fullBits[bitIndex] || 0;
      if (bit === 0) { // Only add black squares, white is background
        const cell = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        cell.setAttribute("x", j - 0.01);
        cell.setAttribute("y", i - 0.01);
        cell.setAttribute("width", 1.02);
        cell.setAttribute("height", 1.02);
        cell.setAttribute("fill", "black");
        tagGroup.appendChild(cell);
      }
    }
  }

  // Add tag metadata
  svg.tagData = {
    tagType: "apriltag",
    tagFamily: family,
    tagID: id,
    bits: fullBits,
    size: size,
    margin: margin
  };

  return svg;
};

/**
 * Convert SVG element to image URL
 * @param {SVGElement} svgElement - The SVG element to convert
 * @returns {string} - Image URL
 */
export const svgToImageUrl = (svgElement) => {
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  
  const svgBlob = new Blob(
    [
      '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n',
      '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n',
      svgString,
    ],
    { type: "image/svg+xml" }
  );
  
  return URL.createObjectURL(svgBlob);
};

/**
 * Get DOM node from SVG element
 * @param {SVGElement} svgElement - The SVG element
 * @returns {Node} - DOM node
 */
export const getSvgNode = (svgElement) => {
  return svgElement.cloneNode(true);
};