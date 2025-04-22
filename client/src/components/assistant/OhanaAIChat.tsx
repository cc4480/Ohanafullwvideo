import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, X } from "lucide-react";
import axios, { AxiosError } from "axios";
import { v4 as uuidv4 } from "uuid";
import logoImg from "@assets/OIP.jfif";

type Message = {
  id: number;
  sessionId: string;
  message: string;
  isUser: boolean;
  createdAt: string;
};

export default function OhanaAIChat() {
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

  // Fetch chat history from server with retry mechanism
  const fetchChatHistory = async (sid: string, retryCount: number = 0): Promise<void> => {
    try {
      const response = await axios.get(`/api/chat/${sid}`, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (response.data) {
        setChatHistory(response.data);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      
      // Retry up to 3 times with exponential backoff
      if (retryCount < 3) {
        const backoffTime = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`Retrying in ${backoffTime}ms...`);
        setTimeout(() => fetchChatHistory(sid, retryCount + 1), backoffTime);
      } else if (chatHistory.length === 0) {
        // If we still have no chat history after retries, show a welcome message
        setChatHistory([{
          id: Date.now(),
          sessionId: sid,
          message: "👋 Aloha! I'm Ohana Assistant from Ohana Realty. How can I help with your real estate journey today?",
          isUser: false,
          createdAt: new Date().toISOString()
        }]);
      }
    }
  };

  // Send message to AI assistant with retry capability
  const sendMessage = async (retryCount: number = 0): Promise<void> => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    const userMessage = message;
    setMessage("");
    
    // Generate unique message ID for tracking
    const userMessageId = Date.now();
    
    // Optimistically add user message to chat
    setChatHistory(prev => [
      ...prev,
      {
        id: userMessageId,
        sessionId,
        message: userMessage,
        isUser: true,
        createdAt: new Date().toISOString()
      }
    ]);
    
    try {
      // Set timeout to prevent hanging requests
      const response = await axios.post("/api/chat", {
        sessionId,
        message: userMessage
      }, {
        timeout: 15000, // 15 second timeout
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Update chat history with latest from server
      if (response.data && response.data.history) {
        setChatHistory(response.data.history);
      } else if (response.data && response.data.reply) {
        // Handle alternative response format
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
      
      // Retry on connection errors, with backoff
      if (retryCount < 2 && 
          (axios.isAxiosError(error) && 
          (error.code === "ECONNABORTED" || error.response?.status === 502 || error.response?.status === 503))) {
        console.log(`Retrying message send in ${(retryCount + 1) * 2}s...`);
        setTimeout(() => sendMessage(retryCount + 1), (retryCount + 1) * 2000);
        return;
      }
      
      // Fallback to direct DeepSeek endpoint if chat endpoint fails
      try {
        const fallbackResponse = await axios.post("/api/deepseek", {
          message: userMessage
        }, { timeout: 10000 });
        
        if (fallbackResponse.data && fallbackResponse.data.reply) {
          setChatHistory(prev => [
            ...prev,
            {
              id: Date.now(),
              sessionId,
              message: fallbackResponse.data.reply,
              isUser: false,
              createdAt: new Date().toISOString()
            }
          ]);
          return;
        }
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
      }
      
      // If all else fails, add generic error message
      setChatHistory(prev => [
        ...prev,
        {
          id: Date.now(),
          sessionId,
          message: "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again in a moment, or contact Valentin directly at (956) 324-6714 for immediate assistance.",
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

  // Welcome message shown when chat is initially opened with no history
  const welcomeMessage = () => {
    if (chatHistory.length === 0) {
      return (
        <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-lg mb-4 max-w-[85%] ml-2">
          <p className="text-sm">
            👋 Aloha! I'm Ohana Assistant from Ohana Realty. "Ohana" means family in Hawaiian,
            and we're committed to treating our clients like family. I can help you find properties,
            learn about Laredo neighborhoods, or answer questions about buying or selling a home.
            How can I assist your real estate journey today?
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="ohana-ai-assistant" style={{ position: 'fixed', zIndex: 99999 }}>
      {/* Mobile-optimized float button with hardware acceleration */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          display: isOpen ? 'none' : 'block',
          transform: 'translateZ(0)', // Hardware acceleration
          backfaceVisibility: 'hidden'
        }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-lg shadow-lg h-16 w-16 p-0 flex items-center justify-center bg-white hover:bg-white/90 active:scale-95 transition-transform transform-gpu animate-[pulse-slow_2s_infinite] mobile-optimized"
          style={{ 
            border: '2px solid hsl(215, 80%, 50%)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            touchAction: 'manipulation',
            WebkitTapHighlightColor: 'transparent'
          }}
        >
          <img 
            src={logoImg} 
            alt="Ohana Realty" 
            className="w-full h-full object-contain p-1 transform-gpu hover:scale-105 transition-transform" 
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
          />
        </Button>
      </div>
      
      {/* Mobile-optimized chat dialog */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: 'min(380px, calc(100vw - 48px))', // Responsive width
            height: 'min(500px, calc(100vh - 100px))', // Responsive height
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            border: '2px solid hsl(215, 80%, 50%)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 99999,
            transform: 'translateZ(0)', // Hardware acceleration
            backfaceVisibility: 'hidden',
            touchAction: 'manipulation'
          }}
          className="dark:bg-slate-900 animate-fade-in mobile-optimized"
        >
          {/* Chat header */}
          <div 
            style={{
              background: 'linear-gradient(to right, hsl(215, 80%, 50%), hsl(215, 80%, 60%))',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                backgroundColor: 'white', 
                borderRadius: '4px',
                overflow: 'hidden' 
              }}>
                <img src={logoImg} alt="Ohana Realty" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 500 }}>Ohana Assistant</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>Your real estate guide</div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsOpen(false)}
              style={{ 
                height: '28px', 
                width: '28px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white'
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Mobile-optimized chat messages */}
          <div 
            style={{ 
              flex: 1, 
              overflowY: 'auto', 
              overflowX: 'hidden',
              WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              scrollBehavior: 'smooth',
              transform: 'translateZ(0)', // Hardware acceleration
              backfaceVisibility: 'hidden'
            }}
            className="bg-gray-50 dark:bg-slate-950"
          >
            {welcomeMessage()}
            
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.isUser ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: msg.isUser ? 'hsl(215, 80%, 50%)' : 'white',
                    color: msg.isUser ? 'white' : 'inherit',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderTopRightRadius: msg.isUser ? '2px' : '8px',
                    borderTopLeftRadius: msg.isUser ? '8px' : '2px'
                  }}
                  className={msg.isUser ? '' : 'dark:bg-slate-800 dark:text-white'}
                >
                  <p style={{ fontSize: '14px', whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{msg.message}</p>
                  <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7, textAlign: 'right' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderTopLeftRadius: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  className="dark:bg-slate-800"
                >
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <span 
                      style={{ 
                        height: '8px', 
                        width: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: 'hsl(215, 80%, 50%, 0.6)',
                        animation: 'pulse 1s infinite'
                      }}
                    ></span>
                    <span 
                      style={{ 
                        height: '8px', 
                        width: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: 'hsl(215, 80%, 50%, 0.6)',
                        animation: 'pulse 1s infinite',
                        animationDelay: '0.3s'
                      }}
                    ></span>
                    <span 
                      style={{ 
                        height: '8px', 
                        width: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: 'hsl(215, 80%, 50%, 0.6)',
                        animation: 'pulse 1s infinite',
                        animationDelay: '0.6s'
                      }}
                    ></span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Mobile-optimized chat input */}
          <div 
            style={{ 
              padding: '12px', 
              borderTop: '1px solid rgba(0,0,0,0.1)',
              backgroundColor: 'white',
              transform: 'translateZ(0)', // Hardware acceleration
              backfaceVisibility: 'hidden'
            }}
            className="dark:bg-slate-900 dark:border-slate-800"
          >
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                style={{ 
                  flex: 1,
                  height: '42px', // Taller input for touch targets
                  fontSize: '15px',
                  borderRadius: '20px'
                }}
                className="focus:ring-primary"
                disabled={isLoading}
                autoComplete="off" // Prevent keyboard suggestions from covering view
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!message.trim() || isLoading}
                style={{ 
                  backgroundColor: 'hsl(215, 80%, 50%)', 
                  color: 'white',
                  width: '42px',
                  height: '42px',
                  padding: 0,
                  minWidth: 'unset',
                  borderRadius: '50%',
                  transform: 'translateZ(0)',
                  touchAction: 'manipulation'
                }}
                className="hover:brightness-110 active:scale-95 transition-transform shadow-md"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}