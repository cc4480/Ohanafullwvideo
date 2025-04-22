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
      {/* Float button that's always visible */}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 99999,
          display: isOpen ? 'none' : 'block'
        }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-lg shadow-lg h-16 w-16 p-0 flex items-center justify-center bg-white hover:bg-white/90"
          style={{ 
            border: '2px solid hsl(215, 80%, 50%)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }}
        >
          <img 
            src={logoImg} 
            alt="Ohana Realty" 
            className="w-full h-full object-contain p-1" 
          />
        </Button>
      </div>
      
      {/* Chat dialog */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '380px',
            height: '500px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            border: '2px solid hsl(215, 80%, 50%)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 99999
          }}
          className="dark:bg-slate-900"
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
          
          {/* Chat messages */}
          <div 
            style={{ 
              flex: 1, 
              overflowY: 'auto', 
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
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
          
          {/* Chat input */}
          <div 
            style={{ 
              padding: '12px', 
              borderTop: '1px solid rgba(0,0,0,0.1)',
              backgroundColor: 'white'
            }}
            className="dark:bg-slate-900 dark:border-slate-800"
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                style={{ flex: 1 }}
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={!message.trim() || isLoading}
                style={{ 
                  backgroundColor: 'hsl(215, 80%, 50%)', 
                  color: 'white',
                  width: '36px',
                  height: '36px',
                  padding: 0,
                  minWidth: 'unset'
                }}
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