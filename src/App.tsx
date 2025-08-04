import { useState } from 'react'
import dayjs from 'dayjs'
import toast, { Toaster } from 'react-hot-toast'
import './App.css'
import BotConfigForm from './components/BotConfigForm'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import LogPanel from './components/LogPanel'
import { LLMService } from './services/llmService'
import { truncateText } from './utils/textUtils'
import type { BotConfig, Message, LogEntry } from './types'
import type { ChatMessage } from './services/llmService'

function App() {
  // Default configuration
  const defaultConfig: BotConfig = {
    name: 'Build Bot',
    persona: 'A helpful assistant specialized in software development and building applications.',
    model: 'mistral-7b'
  };

  // Local State Management
  const [activeConfig, setActiveConfig] = useState<BotConfig>(defaultConfig);
  const [draftConfig, setDraftConfig] = useState<BotConfig>(defaultConfig);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [chatLogs, setChatLogs] = useState<LogEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Keep track of conversation context for API calls
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);

  // Handle session reset
  const handleSessionReset = () => {
    setActiveConfig(defaultConfig);
    setDraftConfig(defaultConfig);
    setHasUnsavedChanges(false);
    setChatHistory([]);
    setChatLogs([]);
    setConversationHistory([]);
    setIsProcessing(false);
    console.log('Session reset to default configuration');
  };

  // Handle draft config updates (changes in form)
  const handleDraftConfigUpdate = (newConfig: BotConfig) => {
    setDraftConfig(newConfig);
    // Check if there are unsaved changes
    const hasChanges = JSON.stringify(newConfig) !== JSON.stringify(activeConfig);
    setHasUnsavedChanges(hasChanges);
    console.log('Draft configuration updated:', newConfig);
  };

  // Handle saving configuration (applying draft to active)
  const handleSaveConfiguration = () => {
    setActiveConfig(draftConfig);
    setHasUnsavedChanges(false);
    
    // Clear conversation history when config changes significantly
    if (draftConfig.name !== activeConfig.name || draftConfig.persona !== activeConfig.persona) {
      setConversationHistory([]);
    }
    
    // Show success toast (we'll add this library)
    console.log('Configuration saved successfully:', draftConfig);
    
    // Show success toast
    toast.success('Bot configuration saved successfully!', {
      duration: 3000,
      position: 'top-right',
    });
  };

  // Send Message Logic
  const handleSendMessage = async (messageContent: string) => {
    const trimmedMessage = messageContent.trim();
    if (!trimmedMessage) {
      return;
    }

    if (trimmedMessage.length > 1000) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        type: 'bot',
        content: 'Message too long! Please keep your messages under 1000 characters.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: trimmedMessage,
      timestamp: new Date()
    };

    // Update chat history
    setChatHistory(prev => [...prev, userMessage]);
    setIsProcessing(true);

    try {
      const botResponse = await LLMService.sendMessage(
        trimmedMessage,
        activeConfig,
        conversationHistory
      );

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: botResponse,
        timestamp: new Date()
      };

      // Update chat history with response
      setChatHistory(prev => [...prev, botMessage]);

      // Update conversation history for context
      const newConversationHistory: ChatMessage[] = [
        ...conversationHistory,
        { role: 'user' as const, content: trimmedMessage },
        { role: 'assistant' as const, content: botResponse }
      ].slice(-10);
      
      setConversationHistory(newConversationHistory);

      const logEntry: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: dayjs().format('h:mmA'), // Human readable timestamp
        model: activeConfig.model,
        question: truncateText(trimmedMessage, 50),
        answer: truncateText(botResponse, 50),
        fullQuestion: trimmedMessage,
        fullAnswer: botResponse
      };

      // Maintain last 5 logs
      setChatLogs(prev => {
        const newLogs = [...prev, logEntry];
        return newLogs.slice(-5);
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorContent = 'Sorry, I encountered an error. ';
      
      if (error instanceof Error) {
        if (error.message.includes('Network error')) {
          errorContent += 'Please check your internet connection and try again.';
        } else if (error.message.includes('Authentication failed')) {
          errorContent += 'API authentication failed. Please check your API key configuration.';
        } else if (error.message.includes('Rate limit')) {
          errorContent += 'Too many requests. Please wait a moment before trying again.';
        } else {
          errorContent += error.message;
        }
      } else {
        errorContent += 'An unknown error occurred. Please try again.';
      }
      
      const errorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        type: 'bot',
        content: errorContent,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Build Bot Mini App</h1>
          <p className="text-gray-600">Configure your own AI chatbot and ask it anything, instantly.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          {/* Left Panel: Bot Config Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200">
              <BotConfigForm 
                config={draftConfig} 
                onConfigUpdate={handleDraftConfigUpdate}
                onSaveConfiguration={handleSaveConfiguration}
                onSessionReset={handleSessionReset}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </div>
          </div>

          {/* Middle Panel: Chat Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col h-[600px] min-h-[600px]">
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <h2 className="text-lg font-semibold text-gray-800">Chat with {activeConfig.name}</h2>
                <p className="text-sm text-gray-500">Model: {activeConfig.model}</p>
              </div>
              <div className="flex-1 flex flex-col min-h-0">
                <ChatWindow messages={chatHistory} />
                <div className="border-t border-gray-200 flex-shrink-0">
                  <ChatInput 
                    onSendMessage={handleSendMessage} 
                    disabled={isProcessing || hasUnsavedChanges}
                  />
                  {hasUnsavedChanges && (
                    <div className="px-4 pb-3 bg-yellow-50 border-t border-yellow-200">
                      <div className="flex items-center text-sm text-yellow-700">
                        <div className="mr-2">⚠️</div>
                        <span>Please save your configuration before sending messages.</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Log Panel */}
        <LogPanel logs={chatLogs} botName={activeConfig.name} />
        
        {/* Toast Notifications */}
        <Toaster />
      </div>
    </div>
  );
}

export default App
