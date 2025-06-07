import React from "react";
import { useCopyToClipboard } from "../../hooks/useCopyToClipboard";

const Modal = ({ isOpen, content, onClose }) => {
  const { copyToClipboard, showCopySuccess, showCopyError } = useCopyToClipboard();

  const handleCopy = async () => {
    const textToCopy = content?.content || "";
    console.log("Modal copy triggered, content length:", textToCopy.length);
    
    const result = await copyToClipboard(textToCopy);
    
    if (result.success) {
      showCopySuccess(true, result.method);
    } else {
      // If all methods fail, try to select the modal content and let user manually copy
      console.log("All copy methods failed, attempting to select modal content for manual copy");
      try {
        const modalContentElement = document.querySelector(".modal-content-text");
        if (modalContentElement) {
          // Create a range and select all content
          const range = document.createRange();
          range.selectNodeContents(modalContentElement);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          
          // Show user that content is selected
          showCopySuccess(true, "manual-selection");
          console.log("✅ Content selected - you can now press Ctrl+C to copy");
        } else {
          showCopyError();
          console.error("Copy failed and modal content not found");
        }
      } catch (selectionError) {
        showCopyError();
        console.error("Copy failed and selection also failed:", selectionError);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
      className="no-drag"
    >
      <div
        style={{
          backgroundColor: "#1e293b",
          borderRadius: "12px",
          width: "90%",
          maxWidth: "800px",
          maxHeight: "90%",
          border: "2px solid #334155",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
        }}
        onClick={(e) => e.stopPropagation()}
        className="no-drag"
      >
        {/* Modal Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #334155",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              margin: 0,
              color: "white",
              fontSize: "18px",
              fontWeight: "600",
            }}
          >
            {content?.title || "Full Content"}
          </h3>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748b",
              fontSize: "24px",
              cursor: "pointer",
              padding: "0",
              width: "30px",
              height: "30px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "white")}
            onMouseLeave={(e) => (e.target.style.color = "#64748b")}
            className="no-drag"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div
          style={{
            padding: "20px",
            overflowY: "auto",
            maxHeight: "calc(90vh - 120px)",
            color: "white",
            fontSize: "14px",
            lineHeight: "1.6",
            fontFamily: "monospace",
            userSelect: "text",
            WebkitUserSelect: "text",
            MozUserSelect: "text",
            msUserSelect: "text",
            cursor: "text",
          }}
          className="chat-scrollbar"
        >
          <pre
            className="modal-content-text"
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              margin: 0,
              fontFamily: "inherit",
              userSelect: "text",
              WebkitUserSelect: "text",
              MozUserSelect: "text",
              msUserSelect: "text",
              cursor: "text",
              outline: "none",
            }}
          >
            {content?.content}
          </pre>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: "20px",
            borderTop: "1px solid #334155",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={handleCopy}
            className="no-drag copy-button"
            style={{
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "background-color 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#059669")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#10b981")}
          >
            <svg
              style={{ width: "16px", height: "16px" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Copy to Clipboard
          </button>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#3b82f6")}
            className="no-drag"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal; 