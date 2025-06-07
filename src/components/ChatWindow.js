import React, { useState, useRef, useEffect } from "react";
import WhisprIcon from "../Image/Whispr-no-bg.png";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Whispr, your personal AI chatbot. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "I can help with various tasks like coding, writing, answering questions, and much more!",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: 3,
      text: "Try typing some long text to test the word wrapping feature, or scroll up to see older messages!",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: 4,
      text: "This is a very long message to demonstrate proper word wrapping functionality. When you type really long messages like this one with lots and lots of text, it should wrap properly within the message bubble instead of overflowing outside the container boundaries.",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: 5,
      text: "Message 5 - You should be able to scroll through all these messages!",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: 6,
      text: "Message 6 - Keep testing the scroll functionality!",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: 7,
      text: "Message 7 - If you can see this and scroll up/down, the scrolling is working!",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: 8,
      text: "Message 8 - Try using your mouse wheel or dragging the scrollbar!",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: 9,
      text: "Message 9 - This should definitely make the chat scrollable now!",
      sender: "bot",
      timestamp: new Date(),
    },
    {
      id: 10,
      text: "Message 10 - Final test message for scrolling!",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        messagesContainerRef.current;
      console.log("Scroll detected:", {
        scrollTop,
        scrollHeight,
        clientHeight,
      });
      // Check if user is near the bottom (within 100px)
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
      console.log("Is near bottom:", isNearBottom);
      setAutoScroll(isNearBottom);
    }
  };

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [messages, autoScroll]);

  // Initial scroll to bottom on component mount
  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
      setAutoScroll(true);
    }, 100);
  }, []);

  // Debug container and ensure scrolling works
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      // Log dimensions for debugging
      setTimeout(() => {
        const scrollInfo = {
          scrollHeight: container.scrollHeight,
          clientHeight: container.clientHeight,
          canScroll: container.scrollHeight > container.clientHeight,
          currentScrollTop: container.scrollTop,
          maxScroll: container.scrollHeight - container.clientHeight,
        };
        console.log("Container scrollable state:", scrollInfo);

        // Test scrolling manually
        window.testScroll = () => {
          console.log("Testing scroll...");
          container.scrollTop = container.scrollHeight;
          console.log("Scrolled to:", container.scrollTop);
        };

        // Test scroll up to show button
        window.testScrollUp = () => {
          console.log("Testing scroll up...");
          container.scrollTop = 0;
          console.log("Scrolled to top:", container.scrollTop);
        };

        // Test if we can scroll
        if (scrollInfo.canScroll) {
          console.log("✅ Container is scrollable");
          console.log(
            "📝 Type window.testScrollUp() to scroll up and see the button"
          );
          console.log("📝 Type window.testScroll() to scroll down");
        } else {
          console.log("❌ Container is NOT scrollable - check content height");
        }
      }, 500);
    }
  }, [messages]);

  // Handle input change without auto-resize
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Keep fixed height - no auto-resize
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const userMessage = inputValue.trim();
    const newMessage = {
      id: Date.now(),
      text: userMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Get AI response from Gemini via IPC
      const aiResponse = await window.electronAPI.sendMessage(userMessage);

      const botResponse = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);

      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting to my AI services right now. Please try again in a moment.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Helper function to check if message is long (code or long text)
  const isLongMessage = (text) => {
    return text.length > 200 || text.includes('```') || text.includes('function') || text.includes('class') || text.includes('import') || text.includes('const') || text.includes('let') || text.includes('var');
  };

  // Helper function to get preview text
  const getPreviewText = (text) => {
    if (text.length <= 200) return text;
    return text.substring(0, 200) + '...';
  };

  // Handle opening modal with full content
  const openModal = (content, title = "Full Content") => {
    setModalContent({ content, title });
    setIsModalOpen(true);
  };

  // Handle closing modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#0f172a",
        color: "white",
      }}
      className="animate-slide-up"
    >
      {/* Header */}
      <div
        style={{
          height: "80px",
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

      {/* Messages Area - Fixed height approach */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="chat-scrollbar no-drag"
        style={{
          height: "calc(100vh - 200px)", // 80px header + 120px input area
          overflowY: "scroll",
          overflowX: "hidden",
          padding: "16px",
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
          <div
            key={message.id}
            className="no-drag"
            style={{
              display: "flex",
              justifyContent:
                message.sender === "user" ? "flex-end" : "flex-start",
              marginBottom: "16px",
              pointerEvents: "auto",
              userSelect: "text",
            }}
          >
            <div
              className="no-drag"
              style={{
                maxWidth: "80%",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor:
                  message.sender === "user" ? "#3b82f6" : "#1e293b",
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
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: "1.5",
                  margin: "0 0 4px 0",
                  wordWrap: "break-word",
                  userSelect: "text",
                  cursor: "text",
                }}
              >
                {isLongMessage(message.text) ? getPreviewText(message.text) : message.text}
              </p>
              {isLongMessage(message.text) && (
                <button
                  onClick={() => openModal(message.text, message.sender === 'user' ? 'Your Message' : 'Whispr Response')}
                  style={{
                    background: 'rgba(59, 130, 246, 0.8)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    padding: '4px 8px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    marginTop: '4px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(59, 130, 246, 1)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.8)'}
                  className="no-drag"
                >
                  Click here to fully view...
                </button>
              )}
              <p
                style={{
                  fontSize: "12px",
                  opacity: 0.7,
                  margin: 0,
                  userSelect: "text",
                  cursor: "text",
                }}
              >
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div
            className="no-drag"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginBottom: "16px",
            }}
          >
            <div
              className="no-drag"
              style={{
                padding: "12px",
                backgroundColor: "#1e293b",
                borderRadius: "8px",
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

      {/* Scroll to bottom button */}
      {!autoScroll && (
        <div
          className="no-drag"
          style={{
            position: "absolute",
            right: "24px",
            bottom: "140px",
            zIndex: 10,
            pointerEvents: "auto",
          }}
        >
          <button
            className="no-drag"
            onClick={() => {
              console.log("Scroll to bottom button clicked");
              if (messagesContainerRef.current) {
                const container = messagesContainerRef.current;
                container.scrollTop = container.scrollHeight;
                console.log(
                  "Scrolled to:",
                  container.scrollTop,
                  "Max:",
                  container.scrollHeight
                );
                setAutoScroll(true);
              }
            }}
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
      )}

      {/* Input Area */}
      <div
        style={{
          height: "120px",
          padding: "16px",
          backgroundColor: "#1e293b",
          borderTop: "1px solid #334155",
          flexShrink: 0,
        }}
        className="no-drag"
      >
        <div style={{ display: "flex", alignItems: "end", gap: "12px" }}>
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send)"
            style={{
              flex: 1,
              height: "80px",
              maxHeight: "80px",
              minHeight: "80px",
              padding: "8px 12px",
              backgroundColor: "#0f172a",
              border: "1px solid #334155",
              borderRadius: "8px",
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
            onClick={handleSendMessage}
            disabled={inputValue.trim() === ""}
            style={{
              width: "48px",
              height: "80px",
              backgroundColor: inputValue.trim() === "" ? "#64748b" : "#3b82f6",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: inputValue.trim() === "" ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (inputValue.trim() !== "") {
                e.target.style.backgroundColor = "#2563eb";
              }
            }}
            onMouseLeave={(e) => {
              if (inputValue.trim() !== "") {
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

      {/* Modal for viewing full content */}
      {isModalOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={closeModal}
          className="no-drag"
        >
          <div
            style={{
              backgroundColor: '#1e293b',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '800px',
              maxHeight: '90%',
              border: '2px solid #334155',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
            className="no-drag"
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '20px',
                borderBottom: '1px solid #334155',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <h3 style={{
                margin: 0,
                color: 'white',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {modalContent?.title || 'Full Content'}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '24px',
                  cursor: 'pointer',
                  padding: '0',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.color = 'white'}
                onMouseLeave={(e) => e.target.style.color = '#64748b'}
                className="no-drag"
              >
                ×
              </button>
            </div>
            
            {/* Modal Content */}
            <div
              style={{
                padding: '20px',
                overflowY: 'auto',
                maxHeight: 'calc(90vh - 120px)',
                color: 'white',
                fontSize: '14px',
                lineHeight: '1.6',
                fontFamily: 'monospace'
              }}
              className="chat-scrollbar"
            >
              <pre style={{
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                margin: 0,
                fontFamily: 'inherit'
              }}>
                {modalContent?.content}
              </pre>
            </div>
            
            {/* Modal Footer */}
            <div
              style={{
                padding: '20px',
                borderTop: '1px solid #334155',
                display: 'flex',
                justifyContent: 'flex-end'
              }}
            >
              <button
                onClick={closeModal}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                className="no-drag"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWindow;
