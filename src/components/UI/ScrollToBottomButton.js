import React from "react";

const ScrollToBottomButton = ({ isVisible, onClick }) => {
  if (!isVisible) return null;

  return (
    <div
      className="no-drag"
      style={{
        position: "absolute",
        right: "32px",
        bottom: "160px",
        zIndex: 10,
        pointerEvents: "auto",
      }}
    >
      <button
        className="no-drag"
        onClick={onClick}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          backgroundColor: "#3b82f6",
          border: "2px solid white",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
          transition: "all 0.2s ease",
          fontSize: "18px",
          fontWeight: "bold",
          pointerEvents: "auto",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#2563eb";
          e.target.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "#3b82f6";
          e.target.style.transform = "scale(1)";
        }}
        title="Scroll to bottom"
      >
        ↓
      </button>
    </div>
  );
};

export default ScrollToBottomButton; 