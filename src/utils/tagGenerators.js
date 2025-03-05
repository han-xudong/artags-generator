import { loadDict } from "./dictLoader";

/**
 * @param {HTMLCanvasElement} canvas
 * @param {string} dictionary
 * @param {number} id
 * @param {number} size
 * @param {number} margin
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

  canvas.width = (size + 2 * margin) * dpi / 25.4;
  canvas.height = (size + 2 * margin) * dpi / 25.4;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cellSize = size * dpi / 25.4 / (markerBits + 2);

  for (let i = 1; i < markerBits + 1; i++) {
    for (let j = 1; j < markerBits + 1; j++) {
      const bitIndex = (i - 1) * markerBits + j - 1;
      const bit = bits[bitIndex] || 0;
      ctx.fillStyle = bit ? "white" : "black";
      ctx.fillRect(
        margin * dpi / 25.4 + j * cellSize,
        margin * dpi / 25.4 + i * cellSize,
        cellSize + 1,
        cellSize + 1
      );
    }
  }
  for (let i = 0; i < markerBits + 2; i++) {
    for (let j = 0; j < markerBits + 2; j++) {
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

  canvas.tagData = {
    tagType: "aruco",
    dictionary: dictionary,
    tagID: id,
    bits: bits,
  };

  return canvas;
};

/**

 * @param {HTMLCanvasElement} canvas
 * @param {string} family
 * @param {number} id
 * @param {number} size
 * @param {number} margin
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

  canvas.width = (size + 2 * margin) * dpi / 25.4;
  canvas.height = (size + 2 * margin) * dpi / 25.4;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cellSize = size * dpi / 25.4 / fullGridSize;

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

  for (let i = 0; i < fullGridSize; i++) {
    for (let j = 0; j < fullGridSize; j++) {
      const bitIndex = i * fullGridSize + j;
      const bit = fullBits[bitIndex] || 0;
      ctx.fillStyle = bit ? "white" : "black";
      ctx.fillRect(
        margin * dpi / 25.4 + j * cellSize,
        margin * dpi / 25.4 + i * cellSize,
        cellSize + 1,
        cellSize + 1
      );
    }
  }

  canvas.tagData = {
    tagType: "apriltag",
    tagFamily: family,
    tagID: id,
    bits: fullBits,
  };

  return canvas;
};
