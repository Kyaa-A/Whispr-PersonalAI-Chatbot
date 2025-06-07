import React from "react";
import Message from "./Message";

const MessageList = ({ 
  messages, 
  isTyping, 
  onOpenModal, 
  messagesContainerRef, 
  messagesEndRef, 
  onScroll 
}) => {
  return (
    <div
      ref={messagesContainerRef}
      onScroll={onScroll}
      className="chat-scrollbar no-drag"
      style={{
        height: "calc(100vh - 200px)", // 80px header + 120px input area
        overflowY: "scroll",
        overflowX: "hidden",
        padding: "24px",
        backgroundColor: "#0f172a",
        scrollBehavior: "smooth",
        cursor: "default",
        userSelect: "text",
        WebkitUserSelect: "text",
        MozUserSelect: "text",
        msUserSelect: "text",
      }}
    >
      {messages.map((message) => (
        <Message 
          key={message.id} 
          message={message} 
          onOpenModal={onOpenModal} 
        />
      ))}

      {isTyping && (
        <div
          className="no-drag"
          style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: "20px",
          }}
        >
          <div
            className="no-drag"
            style={{
              padding: "16px 20px",
              backgroundColor: "#1e293b",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full animate-bounce bg-chat-secondary"></div>
              <div
                className="w-2 h-2 rounded-full animate-bounce bg-chat-secondary"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 rounded-full animate-bounce bg-chat-secondary"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 