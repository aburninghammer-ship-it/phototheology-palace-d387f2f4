// Genesis 1-24 24FPS Room Images
// Using dynamic imports for better performance

export const genesisImages: Record<number, () => Promise<{ default: string }>> = {
  1: () => import("./genesis-01.jpg"),
  2: () => import("./genesis-02.jpg"),
  3: () => import("./genesis-03.jpg"),
  4: () => import("./genesis-04.jpg"),
  5: () => import("./genesis-05.jpg"),
  6: () => import("./genesis-06.jpg"),
  7: () => import("./genesis-07.jpg"),
  8: () => import("./genesis-08.jpg"),
  9: () => import("./genesis-09.jpg"),
  10: () => import("./genesis-10.jpg"),
  11: () => import("./genesis-11.jpg"),
  12: () => import("./genesis-12.jpg"),
  13: () => import("./genesis-13.jpg"),
  14: () => import("./genesis-14.jpg"),
  15: () => import("./genesis-15.jpg"),
  16: () => import("./genesis-16.jpg"),
  17: () => import("./genesis-17.jpg"),
  18: () => import("./genesis-18.jpg"),
  19: () => import("./genesis-19.jpg"),
  20: () => import("./genesis-20.jpg"),
  21: () => import("./genesis-21.jpg"),
  22: () => import("./genesis-22.jpg"),
  23: () => import("./genesis-23.jpg"),
  24: () => import("./genesis-24.jpg"),
};

export const getGenesisImage = async (chapter: number): Promise<string> => {
  if (chapter < 1 || chapter > 24) {
    throw new Error(`Chapter ${chapter} is out of range. Must be between 1 and 24.`);
  }
  const imageModule = await genesisImages[chapter]();
  return imageModule.default;
};
