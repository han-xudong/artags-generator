import { create } from "zustand";

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

export const useTagStore = create((set) => ({
  tagType: "aruco",

  dictionary: "DICT_4X4_1000",

  tagFamily: "tag36h11",

  tagID: 0,
  tagSize: 100,
  margin: 0,

  dpi: getDPI(),

  setTagType: (type) => set({ tagType: type }),
  setDictionary: (dict) => set({ dictionary: dict }),
  setTagFamily: (family) => set({ tagFamily: family }),
  setTagID: (id) => set({ tagID: id }),
  setTagSize: (size) => set({ tagSize: size }),
  setMargin: (margin) => set({ margin: margin }),
  setDpi: (dpi) => set({ dpi: dpi }),
}));
