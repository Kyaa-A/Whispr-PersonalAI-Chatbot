export const INITIAL_MESSAGES = [
  {
    id: 1,
    text: `Hello! I'm **Whispr**, your personal AI chatbot. How can I assist you today?`,
    sender: "bot",
    timestamp: new Date(),
  },
];

export const MESSAGE_CONFIG = {
  LONG_MESSAGE_THRESHOLD: 200,
  CODE_KEYWORDS: ["```", "function", "class", "import", "const", "let", "var"],
  PREVIEW_LENGTH: 160,
};

export const UI_CONFIG = {
  SCROLL_THRESHOLD: 100,
  COPY_SUCCESS_DURATION: 2000,
  HEADER_HEIGHT: "80px",
  INPUT_HEIGHT: "120px",
};
