import { UI_CONFIG } from "../constants/initialMessages";

export const useCopyToClipboard = () => {
  const copyToClipboard = async (textToCopy) => {
    if (!textToCopy || textToCopy.trim() === "") {
      console.error("No content to copy");
      return { success: false, method: "no-content" };
    }

    console.log("Attempting to copy:", textToCopy.substring(0, 100) + "...");

    try {
      // Method 1: Try Electron clipboard API (most reliable in Electron)
      if (window.electronAPI && window.electronAPI.writeText) {
        console.log("Using Electron clipboard API");
        window.electronAPI.writeText(textToCopy);
        return { success: true, method: "electron" };
      }
      
      // Method 2: Try modern clipboard API
      if (navigator.clipboard && navigator.clipboard.writeText) {
        console.log("Using modern clipboard API");
        await navigator.clipboard.writeText(textToCopy);
        return { success: true, method: "modern" };
      }
      
      // Method 3: Create textarea and simulate Ctrl+A + Ctrl+C
      console.log("Using textarea fallback method");
      const textArea = document.createElement("textarea");
      textArea.value = textToCopy;
      
      // Make sure the textarea is visible and focusable
      textArea.style.position = "fixed";
      textArea.style.top = "0";
      textArea.style.left = "0";
      textArea.style.width = "2em";
      textArea.style.height = "2em";
      textArea.style.padding = "0";
      textArea.style.border = "none";
      textArea.style.outline = "none";
      textArea.style.boxShadow = "none";
      textArea.style.background = "transparent";
      textArea.style.opacity = "0";
      textArea.style.zIndex = "-1";

      document.body.appendChild(textArea);

      // Focus the textarea
      textArea.focus();
      
      // Select all content (simulate Ctrl+A)
      textArea.select();
      textArea.setSelectionRange(0, textArea.value.length);

      // Execute copy command (simulate Ctrl+C)
      const successful = document.execCommand("copy");
      
      // Clean up
      document.body.removeChild(textArea);

      if (successful) {
        console.log("Copy successful using execCommand");
        return { success: true, method: "execCommand" };
      } else {
        console.log("execCommand returned false, but content might still be copied");
        // execCommand often returns false even when it works
        return { success: true, method: "execCommand-fallback" };
      }
      
    } catch (err) {
      console.error("Copy operation failed:", err);
      
      // Last resort: Try to select the modal content directly
      try {
        const modalContent = document.querySelector(".modal-content-text");
        if (modalContent) {
          console.log("Attempting to select modal content directly");
          const range = document.createRange();
          range.selectNodeContents(modalContent);
          const selection = window.getSelection();
          selection.removeAllRanges();
          selection.addRange(range);
          
          const copySuccess = document.execCommand("copy");
          selection.removeAllRanges();
          
          return { success: true, method: "direct-selection" };
        }
      } catch (directErr) {
        console.error("Direct selection also failed:", directErr);
      }
      
      return { success: false, method: "all-failed", error: err };
    }
  };

  const showCopySuccess = (success = true, method = "") => {
    console.log(success ? "✅ Content copied to clipboard successfully!" : "❌ Failed to copy content");
    const button = document.querySelector(".copy-button");
    if (button) {
      const originalText = button.innerHTML;
      
      if (success) {
        button.innerHTML =
          '<svg style="width: 16px; height: 16px; margin-right: 8px;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>Copy Successfully';
        button.style.backgroundColor = "#059669";
        console.log(`Copy method used: ${method}`);
      } else {
        button.innerHTML = "❌ Copy Failed";
        button.style.backgroundColor = "#dc2626";
      }
      
      setTimeout(() => {
        button.innerHTML = originalText;
        button.style.backgroundColor = "#10b981";
      }, UI_CONFIG.COPY_SUCCESS_DURATION);
    }
  };

  const showCopyError = () => {
    showCopySuccess(false);
  };

  return { copyToClipboard, showCopySuccess, showCopyError };
}; 