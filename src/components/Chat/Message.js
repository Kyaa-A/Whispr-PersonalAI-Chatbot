import React from "react";
import { isLongMessage, formatTime } from "../../utils/messageUtils";
import { formatText, formatPreviewText } from "../../utils/textFormatter";
import { MESSAGE_CONFIG } from "../../constants/initialMessages";

const Message = ({ message, onOpenModal }) => {
  return (
    <div
      className="no-drag"
      style={{
        display: "flex",
        justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
        marginBottom: "20px",
        pointerEvents: "auto",
        userSelect: "text",
      }}
    >
      <div
        className="no-drag"
        style={{
          maxWidth: "80%",
          padding: "16px 20px",
          borderRadius: "12px",
          backgroundColor: message.sender === "user" ? "#3b82f6" : "#1e293b",
          color: "white",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          wordWrap: "break-word",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          cursor: "text",
          userSelect: "text",
          WebkitUserSelect: "text",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            lineHeight: "1.6",
            margin: "0 0 8px 0",
            wordWrap: "break-word",
            userSelect: "text",
            cursor: "text",
          }}
        >
          {isLongMessage(message.text) 
            ? <div style={{ opacity: 0.95 }}>{formatPreviewText(message.text, MESSAGE_CONFIG.PREVIEW_LENGTH)}</div>
            : formatText(message.text)}
        </div>
        {isLongMessage(message.text) && (
          <button
            onClick={() =>
              onOpenModal(
                message.text,
                message.sender === "user" ? "Your Message" : "Whispr Response"
              )
            }
            style={{
              background: "rgba(59, 130, 246, 0.8)",
              border: "none",
              borderRadius: "6px",
              color: "white",
              padding: "6px 12px",
              fontSize: "12px",
              cursor: "pointer",
              marginTop: "8px",
              marginBottom: "8px",
              transition: "background-color 0.2s",
              display: "block",
            }}
            onMouseEnter={(e) =>
              (e.target.style.background = "rgba(59, 130, 246, 1)")
            }
            onMouseLeave={(e) =>
              (e.target.style.background = "rgba(59, 130, 246, 0.8)")
            }
            className="no-drag"
          >
            Click Here To Fully View
          </button>
        )}
        <p
          style={{
            fontSize: "12px",
            opacity: 0.7,
            margin: "4px 0 0 0",
            userSelect: "text",
            cursor: "text",
          }}
        >
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default Message; 