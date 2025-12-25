export const RENOVATED_ROOMS = [
  "sr",
  "24fps",
  "st",
  "ir",
  "tr",
  "gr",
  "or",
  "dc",
  "fe",
  "bl",
  "123h",
] as const;

export const RENOVATED_ROOMS_SET = new Set<string>(RENOVATED_ROOMS);

export const isRoomRenovated = (roomId: string): boolean => {
  return RENOVATED_ROOMS_SET.has(roomId);
};
