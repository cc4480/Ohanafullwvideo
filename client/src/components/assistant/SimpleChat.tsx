import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, X } from "lucide-react";
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

export default function SimpleChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID and load chat history
  useEffect(() => {
    const storedSessionId = localStorage.getItem("chatSessionId");
    const newSessionId = storedSessionId || uuidv4();
    
    if (!storedSessionId) {
      localStorage.setItem("chatSessionId", newSessionId);
    }
    
    setSessionId(newSessionId);
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
  const sendMessage = async (retryCount: number = 0) => {
    const userMessage = message.trim();
    if (!userMessage || isLoading) return;
    
    setMessage("");
    setIsLoading(true);
    
    // Add user message to chat
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
      
      if (response.data.history) {
        setChatHistory(response.data.history);
      } else if (response.data.reply) {
        setChatHistory(prev => [
          ...prev,
          {
            id: Date.now(),
            sessionId,
            message: response.data.reply,
            isUser: false,
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      
      setChatHistory(prev => [
        ...prev,
        {
          id: Date.now(),
          sessionId,
          message: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
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
      sendMessage(0);
    }
  };

  // Welcome message shown when chat is initially opened with no history
  const welcomeMessage = () => {
    if (chatHistory.length === 0) {
      return (
        <div className="bg-primary/10 p-3 rounded-lg mb-4">
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
    <div>
      {/* Chat toggle button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-16 w-16 rounded-full bg-white shadow-lg border-2 border-primary p-0"
          >
            <img 
              src={logoImg} 
              alt="Ohana Realty" 
              className="w-full h-full object-contain p-1" 
            />
          </Button>
        </div>
      )}
      
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-primary/30 flex flex-col overflow-hidden z-50">
          {/* Chat header */}
          <div className="bg-primary text-white p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-md overflow-hidden">
                <img src={logoImg} alt="Ohana Realty" className="w-full h-full object-contain" />
              </div>
              <div>
                <h3 className="font-medium">Ohana Assistant</h3>
                <p className="text-xs text-white/80">Your real estate guide</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 rounded-full bg-white/10 hover:bg-white/20 text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
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
                  className={`max-w-[85%] p-3 rounded-lg shadow-md ${
                    msg.isUser
                      ? "bg-primary text-white"
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
              <div className="flex justify-start">
                <div className="max-w-[85%] p-3 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-gray-100 dark:border-slate-700 rounded-tl-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-neutral-500">Typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat input */}
          <div className="p-3 border-t border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900">
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
                onClick={() => sendMessage(0)}
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
      )}
    </div>
  );
}