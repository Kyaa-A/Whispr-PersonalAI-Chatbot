import { MESSAGE_CONFIG } from "../constants/initialMessages";
import { getPlainText } from "./textFormatter";

export const isLongMessage = (text) => {
  // Don't show "View More" for code blocks
  if (text.includes('```')) {
    return false;
  }
  const plainText = getPlainText(text);
  // Only consider actual long text messages
  return plainText.length > MESSAGE_CONFIG.LONG_MESSAGE_THRESHOLD;
};

export const getPreviewText = (text) => {
  const plainText = getPlainText(text);
  if (plainText.length <= MESSAGE_CONFIG.PREVIEW_LENGTH) return text;
  return plainText.substring(0, MESSAGE_CONFIG.PREVIEW_LENGTH) + "...";
};

export const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}; 