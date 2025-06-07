import React from "react";
import WhisprIcon from "../../Image/Whispr-no-bg.png";
import { UI_CONFIG } from "../../constants/initialMessages";

const Header = () => {
  return (
    <div
      style={{
        height: UI_CONFIG.HEADER_HEIGHT,
        padding: "16px",
        backgroundColor: "#1e293b",
        borderBottom: "1px solid #334155",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexShrink: 0,
      }}
      className="no-drag"
    >
      <div className="flex items-center space-x-3">
        <div className="flex justify-center items-center w-10 h-10 rounded-full shadow-black">
          <img src={WhisprIcon} alt="Whispr Icon" className="w-max h-max" />
        </div>
        <div>
          <h1 className="text-lg font-semibold">Whispr</h1>
          <p className="text-xs text-chat-secondary">Personal AI Chatbot</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <div className="mr-2 text-xs text-chat-secondary">
          Press Ctrl+L to toggle
        </div>
        <button
          onClick={() => window.electronAPI?.minimizeWindow()}
          className="flex justify-center items-center w-6 h-6 bg-yellow-500 rounded-full transition-colors duration-200 hover:bg-yellow-600"
          title="Minimize"
        >
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>
        <button
          onClick={() => window.electronAPI?.closeWindow()}
          className="flex justify-center items-center w-6 h-6 bg-red-500 rounded-full transition-colors duration-200 hover:bg-red-600"
          title="Close"
        >
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Header; 