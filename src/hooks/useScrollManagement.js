import { useState, useEffect, useRef } from "react";
import { UI_CONFIG } from "../constants/initialMessages";

export const useScrollManagement = (messages) => {
  const [autoScroll, setAutoScroll] = useState(true);
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
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      console.log("Scroll detected:", { scrollTop, scrollHeight, clientHeight });
      // Check if user is near the bottom (within threshold)
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - UI_CONFIG.SCROLL_THRESHOLD;
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
          console.log("📝 Type window.testScrollUp() to scroll up and see the button");
          console.log("📝 Type window.testScroll() to scroll down");
        } else {
          console.log("❌ Container is NOT scrollable - check content height");
        }
      }, 500);
    }
  }, [messages]);

  return {
    autoScroll,
    setAutoScroll,
    messagesEndRef,
    messagesContainerRef,
    scrollToBottom,
    handleScroll,
  };
}; 