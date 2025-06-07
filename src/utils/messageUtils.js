import { MESSAGE_CONFIG } from "../constants/initialMessages";

export const isLongMessage = (text) => {
  return (
    text.length > MESSAGE_CONFIG.LONG_MESSAGE_THRESHOLD ||
    MESSAGE_CONFIG.CODE_KEYWORDS.some(keyword => text.includes(keyword))
  );
};

export const getPreviewText = (text) => {
  if (text.length <= MESSAGE_CONFIG.PREVIEW_LENGTH) return text;
  return text.substring(0, MESSAGE_CONFIG.PREVIEW_LENGTH) + "...";
};

export const formatTime = (date) => {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}; 