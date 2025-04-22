import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, MessageSquare, Send, X } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import logoImg from "@assets/OIP.jfif";

type Message = {
  id: number;
  sessionId: string;
  message: string;
  isUser: boolean;
  createdAt: string;
};

// CRITICAL COMPONENT - DO NOT REMOVE OR MODIFY THE FLOATING CHAT ICON
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
            👋 Hello! I'm your real estate assistant from Ohana Realty. I can help you find properties,
            learn about Laredo neighborhoods, or answer questions about buying or selling a home.
            How can I assist with your real estate needs today?
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {/* Chat toggle button - CRITICAL COMPONENT: DO NOT REMOVE */}
      <Button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 rounded-lg h-16 w-16 p-0 flex items-center justify-center bg-white hover:bg-white/95 transition-all duration-300 z-[9999]
          ${isOpen && !isMinimized ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
          border-2 border-primary shadow-xl
          transform-gpu active:scale-95
          mobile-optimized
        `}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent'
        }}
        aria-label="Chat with Ohana Assistant"
      >
        <div className="flex items-center justify-center w-full h-full bg-white rounded-md overflow-hidden">
          {/* Company logo instead of message icon */}
          <img 
            src={logoImg} 
            alt="Ohana Realty" 
            className="w-full h-full object-contain p-1 transform-gpu" 
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              willChange: 'transform'
            }}
          />
        </div>
        
        {/* Pulsing effect around the button */}
        <div className="absolute -inset-1 rounded-lg bg-primary/20 animate-ping opacity-75 z-[-1]"></div>
      </Button>
      
      {/* Chat window - CRITICAL COMPONENT: DO NOT REMOVE */}
      <div 
        className={`
          fixed sm:bottom-6 sm:right-6 w-full sm:w-96 h-[95vh] sm:h-[500px] bg-white dark:bg-slate-900 rounded-lg sm:shadow-2xl flex flex-col overflow-hidden transition-all duration-500 z-[9998]
          border border-primary/30 backdrop-blur-sm
          sm:max-w-md
          ${isOpen && !isMinimized ? 'opacity-100 bottom-0 left-0 sm:left-auto right-0 sm:scale-100' : 'opacity-0 scale-95 h-0 pointer-events-none'}
          transform-gpu
        `}
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          willChange: 'transform',
          touchAction: 'manipulation'
        }}
      >
        {/* Decorative gradients */}
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Chat header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-3 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-transparent rounded-md overflow-hidden">
              <img src={logoImg} alt="Ohana Realty" className="w-full h-full object-contain bg-transparent" />
            </div>
            <div>
              <h3 className="font-medium">Ohana Assistant</h3>
              <p className="text-xs text-white/80">Your real estate guide</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
              onClick={minimizeChat}
            >
              <span className="sr-only">Minimize</span>
              <span className="h-0.5 w-4 bg-current rounded-full"></span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-slate-950 dark:to-slate-900 relative">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
          
          {welcomeMessage()}
          
          {chatHistory.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${msg.isUser ? "justify-end" : "justify-start"} animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`max-w-[85%] p-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg ${
                  msg.isUser
                    ? "bg-gradient-to-r from-primary to-primary/90 text-white"
                    : "bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700"
                } ${msg.isUser ? "rounded-tr-sm" : "rounded-tl-sm"}`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                <div className="text-xs mt-1 opacity-70 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="max-w-[85%] p-3 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-gray-100 dark:border-slate-700 rounded-tl-sm">
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent to-white dark:to-slate-800 opacity-60"></span>
                  </div>
                  <div className="flex space-x-1">
                    <span className="h-2 w-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0s" }}></span>
                    <span className="h-2 w-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0.3s" }}></span>
                    <span className="h-2 w-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0.6s" }}></span>
                  </div>
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
      
      {/* Minimized chat - CRITICAL COMPONENT: DO NOT REMOVE */}
      <div 
        className={`
          fixed bottom-24 right-6 bg-transparent rounded-lg p-3 pr-10 transition-all duration-300 z-50 
          border-0 cursor-pointer
          ${isMinimized ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}
        onClick={() => setIsMinimized(false)}
      >
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-transparent rounded-md overflow-hidden border-0">
            <img src={logoImg} alt="Ohana Realty" className="w-full h-full object-contain bg-transparent" />
          </div>
          <p className="text-sm font-medium">Chat with Ohana Assistant</p>
        </div>
      </div>
    </>
  );
}