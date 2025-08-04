import React, { useState } from 'react';
import type { KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    
    // Prevent empty messages
    if (!trimmedMessage || disabled || isTyping) return;
    
    setIsTyping(true);
    onSendMessage(trimmedMessage);
    setMessage('');
    
    // Reset typing state after delay
    setTimeout(() => setIsTyping(false), 500);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isButtonDisabled = disabled || !message.trim() || isTyping;

  return (
    <div className="p-4 bg-white">
      <div className="flex items-end space-x-3">
        <div className="flex-1">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
            disabled={disabled}
            rows={1}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed resize-none min-h-[50px] max-h-32"
            style={{ minHeight: '50px' }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={isButtonDisabled}
          className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 ${
            isButtonDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95'
          }`}
        >
          {disabled ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Sending...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          )}
        </button>
      </div>
      
      {/* Character counter */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>Shift+Enter for new line</span>
        <span className={message.length > 500 ? 'text-red-500' : ''}>{message.length}/1000</span>
      </div>
    </div>
  );
};

export default ChatInput;