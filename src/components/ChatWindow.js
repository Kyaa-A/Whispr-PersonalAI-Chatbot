import React, { useState, useRef, useEffect } from 'react';

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! I'm Dialogix, your AI desktop assistant powered by Google Gemini. How can I assist you today?", 
      sender: 'bot', 
      timestamp: new Date() 
    },
    { 
      id: 2, 
      text: "I can help with various tasks like coding, writing, answering questions, and much more!", 
      sender: 'bot', 
      timestamp: new Date() 
    },
    { 
      id: 3, 
      text: "Try typing some long text to test the word wrapping feature, or scroll up to see older messages!", 
      sender: 'bot', 
      timestamp: new Date() 
    },
    { 
      id: 4, 
      text: "This is a very long message to demonstrate proper word wrapping functionality. When you type really long messages like this one with lots and lots of text, it should wrap properly within the message bubble instead of overflowing outside the container boundaries.", 
      sender: 'bot', 
      timestamp: new Date() 
    },
    { 
      id: 5, 
      text: "Message 5 - You should be able to scroll through all these messages!", 
      sender: 'bot', 
      timestamp: new Date() 
    },
    { 
      id: 6, 
      text: "Message 6 - Keep testing the scroll functionality!", 
      sender: 'bot', 
      timestamp: new Date() 
    },
    { 
      id: 7, 
      text: "Message 7 - If you can see this and scroll up/down, the scrolling is working!", 
      sender: 'bot', 
      timestamp: new Date() 
    },
    { 
      id: 8, 
      text: "Message 8 - Try using your mouse wheel or dragging the scrollbar!", 
      sender: 'bot', 
      timestamp: new Date() 
    },
    { 
      id: 9, 
      text: "Message 9 - This should definitely make the chat scrollable now!", 
      sender: 'bot', 
      timestamp: new Date() 
    },
    { 
      id: 10, 
      text: "Message 10 - Final test message for scrolling!", 
      sender: 'bot', 
      timestamp: new Date() 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      console.log('Scroll detected:', { scrollTop, scrollHeight, clientHeight });
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 20;
      setAutoScroll(isAtBottom);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, autoScroll]);

  // Initial scroll to bottom on component mount
  useEffect(() => {
    setTimeout(() => {
      scrollToBottom();
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
          currentScrollTop: container.scrollTop
        };
        console.log('Container scrollable check:', scrollInfo);
        
        // Add manual scroll test function to window for debugging
        window.testScroll = () => {
          container.scrollTop += 100;
          console.log('Manual scroll test executed, new scrollTop:', container.scrollTop);
        };
        
        console.log('To test scroll manually, run: window.testScroll() in console');
      }, 100);
    }
  }, [messages]);

  // Handle input change without auto-resize
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    // Keep fixed height - no auto-resize
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage = inputValue.trim();
    const newMessage = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Get AI response from Gemini via IPC
      const aiResponse = await window.electronAPI.sendMessage(userMessage);
      
      const botResponse = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      const errorResponse = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting to my AI services right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex overflow-hidden relative flex-col w-screen h-screen text-white bg-chat-bg animate-slide-up">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b no-drag bg-chat-surface border-chat-border">
        <div className="flex items-center space-x-3">
          <div className="flex justify-center items-center w-8 h-8 rounded-full bg-chat-primary">
            <svg 
              className="w-5 h-5 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold">AI Assistant</h1>
            <p className="text-xs text-chat-secondary">Always ready to help</p>
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
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <button
            onClick={() => window.electronAPI?.closeWindow()}
            className="flex justify-center items-center w-6 h-6 bg-red-500 rounded-full transition-colors duration-200 hover:bg-red-600"
            title="Close"
          >
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

            {/* Messages Area */}
      <div 
        ref={messagesContainerRef}
        className="chat-scrollbar" 
        onScroll={handleScroll}
        style={{ 
          height: 'calc(100vh - 180px)', // Fixed height instead of flex
          overflowY: 'auto', // Use auto instead of scroll
          overflowX: 'hidden',
          padding: '16px',
          backgroundColor: '#0f172a' // Ensure background
        }}
      >
        <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            style={{ flexShrink: 0 }} // Prevent messages from shrinking
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-chat-primary text-white'
                  : 'bg-chat-surface text-gray-100'
              } shadow-lg`}
              style={{
                wordWrap: 'break-word',
                wordBreak: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              <p className="text-sm leading-relaxed break-words">{message.text}</p>
              <p className="mt-1 text-xs opacity-70">
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="p-3 text-gray-100 rounded-lg shadow-lg bg-chat-surface">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full animate-bounce bg-chat-secondary"></div>
                <div className="w-2 h-2 rounded-full animate-bounce bg-chat-secondary" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 rounded-full animate-bounce bg-chat-secondary" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
        </div>
      </div>

             {/* Scroll to bottom button */}
       {!autoScroll && (
         <div className="absolute right-6 bottom-32">
           <button
             onClick={() => {
               setAutoScroll(true);
               scrollToBottom();
             }}
             className="flex justify-center items-center p-2 text-white rounded-full shadow-lg transition-all duration-200 bg-chat-primary hover:bg-blue-600"
             title="Scroll to bottom"
           >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
             </svg>
           </button>
         </div>
       )}

      {/* Input Area */}
      <div className="p-4 border-t no-drag bg-chat-surface border-chat-border">
        <div className="flex items-end space-x-3">
          <textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Press Enter to send)"
            className="flex-1 px-3 py-2 text-white rounded-lg border transition-all duration-200 chat-input bg-chat-bg border-chat-border placeholder-chat-secondary"
            rows="3"
            style={{ 
              height: '80px', // Fixed height
              maxHeight: '80px', // Fixed max height
              minHeight: '80px', // Fixed min height
              overflowY: 'auto', // Allow scrolling inside textarea when needed
              lineHeight: '1.5',
              resize: 'none' // Prevent manual resize
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={inputValue.trim() === ''}
            className="bg-chat-primary hover:bg-blue-600 disabled:bg-chat-secondary disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center h-[80px] w-12"
          >
            <svg 
              className="w-5 h-5" 
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
    </div>
  );
};

export default ChatWindow; 