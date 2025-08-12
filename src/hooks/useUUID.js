import { v4 as uuidv4 } from "uuid";
import { useMemo } from "react";

export const useUUID = () => {
  return useMemo(() => uuidv4(), []);
};
