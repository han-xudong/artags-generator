/**
 * Tag Store - Global state management for AR tag generation
 * This file provides a centralized store using Zustand to manage tag parameters
 * and configuration across the application.
 */
import { create } from "zustand";

/**
 * Utility function to detect screen DPI
 * Creates a temporary DOM element to measure the actual DPI value
 * @returns {number} The detected DPI value
 */
function getDPI() {
    const div = document.createElement("div");
    div.style.width = "1in";
    div.style.position = "absolute";
    div.style.visibility = "hidden";
    document.body.appendChild(div);
    const dpi = div.offsetWidth;
    document.body.removeChild(div);
    return dpi;
}

/**
 * Tag store hook created with Zustand
 * Provides state and actions for managing tag generation parameters
 */
export const useTagStore = create((set) => ({
  // Tag type selection (aruco or apriltag)
  tagType: "aruco",

  // ArUco dictionary selection
  dictionary: "DICT_4X4_1000",

  // AprilTag family selection
  tagFamily: "tag36h11",

  // Common tag parameters
  tagID: 0,         // Tag identifier
  tagSize: 100,     // Size in millimeters
  margin: 0,        // Margin around tag in millimeters

  // Display parameters
  dpi: getDPI(),    // Screen DPI for accurate sizing

  // Action creators for updating state
  setTagType: (type) => set({ tagType: type }),
  setDictionary: (dict) => set({ dictionary: dict }),
  setTagFamily: (family) => set({ tagFamily: family }),
  setTagID: (id) => set({ tagID: id }),
  setTagSize: (size) => set({ tagSize: size }),
  setMargin: (margin) => set({ margin: margin }),
  setDpi: (dpi) => set({ dpi: dpi }),
}));
