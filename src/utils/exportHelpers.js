/**
 * Export Helpers - Utility functions for exporting tags in different formats
 * This file provides functions to export tags as SVG, PDF, and PNG formats
 * These functions handle the conversion and saving of tag images for various use cases
 */

import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";

/**
 * Export tag as SVG format
 * @param {SVGElement} svgElement - The SVG element to export
 * @param {string} filename - Name for the exported file (without extension)
 * @param {number} tagSize - Size of the tag in millimeters
 * @param {number} margin - Margin around the tag in millimeters
 */
export const exportAsSVG = (svgElement, filename, tagSize, margin) => {
  try {
    // Clone SVG element to avoid modifying the original
    const svg = svgElement.cloneNode(true);
    
    // Ensure correct SVG dimensions
    const totalSize = tagSize + 2 * margin;
    svg.setAttribute("width", totalSize + "mm");
    svg.setAttribute("height", totalSize + "mm");
    
    // Serialize SVG to string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    
    // Create SVG Blob with proper XML headers
    const svgBlob = new Blob(
      [
        '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n',
        '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n',
        svgString,
      ],
      { type: "image/svg+xml" }
    );
    
    // Save file using FileSaver.js
    saveAs(svgBlob, `${filename}.svg`);
  } catch (error) {
    console.error("Error exporting SVG:", error);
    alert("Failed to export SVG. See console for details.");
  }
};

/**
 * Export tag as PDF format
 * @param {SVGElement} svgElement - The SVG element to export
 * @param {string} filename - Name for the exported file (without extension)
 * @param {number} tagSize - Size of the tag in millimeters
 * @param {number} margin - Margin around the tag in millimeters
 */
export const exportAsPDF = (svgElement, filename, tagSize, margin) => {
  try {
    // Create a temporary canvas for converting SVG to image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set appropriate resolution for print quality
    const dpi = 300; // Print quality DPI
    const widthMM = tagSize + 2 * margin;
    const heightMM = tagSize + 2 * margin;
    
    // Convert millimeters to pixels (1 inch = 25.4 mm)
    const widthPx = Math.round(widthMM * dpi / 25.4);
    const heightPx = Math.round(heightMM * dpi / 25.4);
    
    canvas.width = widthPx;
    canvas.height = heightPx;
    
    // Convert SVG to image
    const img = new Image();
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    
    img.onload = () => {
      // Draw image to canvas with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, widthPx, heightPx);
      ctx.drawImage(img, 0, 0, widthPx, heightPx);
      
      // Create PDF document with appropriate dimensions
      const doc = new jsPDF({
        orientation: widthMM > heightMM ? "landscape" : "portrait",
        unit: "mm",
        format: [widthMM + 20, heightMM + 20],
      });
      
      // Add the image to PDF
      const imgData = canvas.toDataURL("image/png", 1.0);
      doc.addImage(imgData, "PNG", 10, 10, widthMM, heightMM);
      
      // Add footer text
      doc.setFontSize(8);
      doc.text(
        `${filename} - Generated by Tag Generator Tool`,
        10,
        heightMM + 15
      );
      
      // Save the PDF file
      doc.save(`${filename}.pdf`);
    };
    
    img.src = svgUrl;
  } catch (error) {
    console.error("Error exporting PDF:", error);
    alert("Failed to export PDF. See console for details.");
  }
};

/**
 * Export tag as PNG format
 * @param {SVGElement} svgElement - The SVG element to export
 * @param {string} filename - Name for the exported file (without extension)
 */
export const exportAsPNG = (svgElement, filename) => {
  try {
    // Create a temporary canvas for converting SVG to PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Get SVG dimensions
    const svgWidth = parseFloat(svgElement.getAttribute('width'));
    const svgHeight = parseFloat(svgElement.getAttribute('height'));
    
    // Set appropriate resolution for high quality
    const dpi = 300; // High resolution DPI
    
    // Convert millimeters to pixels (1 inch = 25.4 mm)
    const widthPx = Math.round(svgWidth * dpi / 25.4);
    const heightPx = Math.round(svgHeight * dpi / 25.4);
    
    canvas.width = widthPx;
    canvas.height = heightPx;
    
    // Convert SVG to image
    const img = new Image();
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString);
    
    img.onload = () => {
      // Draw image to canvas with white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, widthPx, heightPx);
      ctx.drawImage(img, 0, 0, widthPx, heightPx);
      
      // Export as PNG using Blob
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${filename}.png`);
        } else {
          throw new Error("Could not create image blob");
        }
      }, "image/png");
    };
    
    img.src = svgUrl;
  } catch (error) {
    console.error("Error exporting PNG:", error);
    alert("Failed to export PNG. See console for details.");
  }
};
