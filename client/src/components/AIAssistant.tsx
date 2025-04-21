import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquare, Send, X } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

type Message = {
  id: number;
  sessionId: string;
  message: string;
  isUser: boolean;
  createdAt: string;
};

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID and load chat history
  useEffect(() => {
    // Create or retrieve session ID from local storage
    const storedSessionId = localStorage.getItem("chatSessionId");
    const newSessionId = storedSessionId || uuidv4();
    
    if (!storedSessionId) {
      localStorage.setItem("chatSessionId", newSessionId);
    }
    
    setSessionId(newSessionId);
    
    // Load chat history
    fetchChatHistory(newSessionId);
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isOpen]);

  // Fetch chat history from server
  const fetchChatHistory = async (sid: string) => {
    try {
      const response = await axios.get(`/api/chat/${sid}`);
      setChatHistory(response.data);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  // Send message to AI assistant
  const sendMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    const userMessage = message;
    setMessage("");
    
    // Optimistically add user message to chat
    setChatHistory(prev => [
      ...prev,
      {
        id: Date.now(),
        sessionId,
        message: userMessage,
        isUser: true,
        createdAt: new Date().toISOString()
      }
    ]);
    
    try {
      const response = await axios.post("/api/chat", {
        sessionId,
        message: userMessage
      });
      
      // Update chat history with latest from server
      setChatHistory(response.data.history);
    } catch (error) {
      console.error("Error sending message:", error);
      
      // Add error message
      setChatHistory(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sessionId,
          message: "Sorry, I couldn't process your request. Please try again.",
          isUser: false,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  // Welcome message shown when chat is initially opened with no history
  const welcomeMessage = () => {
    if (chatHistory.length === 0) {
      return (
        <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg mb-4 max-w-[85%] ml-2">
          <p className="text-sm">
            👋 Hi there! I'm Valentin AI, your real estate assistant. 
            I can help you find properties, learn about neighborhoods, 
            or answer questions about buying or selling a home in Laredo. 
            How can I assist you today?
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Chat toggle button */}
      <Button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 rounded-full shadow-lg h-14 w-14 p-0 flex items-center justify-center bg-primary hover:bg-primary/90 transition-all duration-300 z-50
          ${isOpen && !isMinimized ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
        `}
        aria-label="Chat with AI assistant"
      >
        <MessageSquare className="h-6 w-6 text-white" />
      </Button>
      
      {/* Chat window */}
      <div 
        className={`
          fixed bottom-6 right-6 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-lg shadow-xl flex flex-col overflow-hidden transition-all duration-300 z-50 border border-border
          ${isOpen && !isMinimized ? 'opacity-100 scale-100 h-[500px]' : 'opacity-0 scale-95 h-0 pointer-events-none'}
        `}
      >
        {/* Chat header */}
        <div className="bg-primary text-white p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <h3 className="font-medium">Valentin AI Assistant</h3>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={minimizeChat}
            >
              <span className="sr-only">Minimize</span>
              <span className="h-0.5 w-4 bg-current rounded-full"></span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gray-50 dark:bg-slate-950">
          {welcomeMessage()}
          
          {chatHistory.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg ${
                  msg.isUser
                    ? "bg-primary text-white"
                    : "bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] p-3 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-gray-100 dark:border-slate-700">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* Chat input */}
        <div className="p-3 border-t border-gray-200 dark:border-slate-800 bg-card">
          <div className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!message.trim() || isLoading}
              size="icon"
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Minimized chat */}
      <div 
        className={`
          fixed bottom-24 right-6 bg-white dark:bg-slate-900 rounded-lg shadow-lg p-3 pr-10 transition-all duration-300 z-50 border border-border cursor-pointer
          ${isMinimized ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}
        onClick={() => setIsMinimized(false)}
      >
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <p className="text-sm font-medium">Chat with Valentin AI</p>
        </div>
      </div>
    </>
  );
}