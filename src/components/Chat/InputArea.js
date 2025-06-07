import React from "react";
import { UI_CONFIG } from "../../constants/initialMessages";

const InputArea = ({ inputValue, onChange, onKeyPress, onSend, isDisabled }) => {
  return (
    <div
      style={{
        height: UI_CONFIG.INPUT_HEIGHT,
        padding: "20px 24px",
        backgroundColor: "#1e293b",
        borderTop: "1px solid #334155",
        flexShrink: 0,
      }}
      className="no-drag"
    >
      <div style={{ display: "flex", alignItems: "end", gap: "16px" }}>
        <textarea
          value={inputValue}
          onChange={onChange}
          onKeyPress={onKeyPress}
          placeholder="Type your message here... (Press Enter to send)"
          style={{
            flex: 1,
            height: "80px",
            maxHeight: "80px",
            minHeight: "80px",
            padding: "12px 16px",
            backgroundColor: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "10px",
            color: "white",
            fontSize: "14px",
            lineHeight: "1.5",
            resize: "none",
            overflowY: "auto",
            outline: "none",
          }}
          className="chat-input placeholder-chat-secondary"
        />
        <button
          onClick={onSend}
          disabled={isDisabled}
          style={{
            width: "48px",
            height: "80px",
            backgroundColor: isDisabled ? "#64748b" : "#3b82f6",
            border: "none",
            borderRadius: "10px",
            color: "white",
            cursor: isDisabled ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => {
            if (!isDisabled) {
              e.target.style.backgroundColor = "#2563eb";
            }
          }}
          onMouseLeave={(e) => {
            if (!isDisabled) {
              e.target.style.backgroundColor = "#3b82f6";
            }
          }}
        >
          <svg
            style={{ width: "20px", height: "20px" }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default InputArea; 