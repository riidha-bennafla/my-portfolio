// components/contact/ContactCard/hooks/useClipboard.ts
import { useCallback } from "react";
import { copyToClipboard } from "../utils/clipboard";

export const useClipboard = () => {
  const copy = useCallback(async (text: string) => {
    try {
      await copyToClipboard(text);
      return true;
    } catch (error) {
      console.error("Clipboard copy failed:", error);
      return false;
    }
  }, []);

  return { copy };
};
