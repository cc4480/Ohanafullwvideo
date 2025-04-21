import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ChatMessage } from "@shared/schema";

export default function AIAssistant() {
  const [message, setMessage] = useState("");
  const [sessionId, setSessionId] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Generate a session ID if one doesn't exist
  useEffect(() => {
    const storedSessionId = localStorage.getItem("aiChatSessionId");
    if (storedSessionId) {
      setSessionId(storedSessionId);
    } else {
      const newSessionId = uuidv4();
      localStorage.setItem("aiChatSessionId", newSessionId);
      setSessionId(newSessionId);
    }
  }, []);
  
  // Get chat history
  const { data: chatHistory, isLoading } = useQuery<ChatMessage[]>({
    queryKey: [`/api/chat/${sessionId}`],
    enabled: !!sessionId,
  });
  
  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest("POST", "/api/chat", {
        sessionId,
        message
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/chat/${sessionId}`] });
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      console.error("Error sending message:", error);
    }
  });
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessageMutation.mutate(message);
  };
  
  return (
    <section className="py-16 bg-gradient-to-r from-primary-dark to-primary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
              Meet Our AI Property Assistant
            </h2>
            <p className="text-neutral-100 mb-8">
              Get instant answers about properties, neighborhoods, and market trends with our AI assistant powered by DeepSeek.
            </p>
            
            <div 
              ref={chatContainerRef}
              className="bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-lg border border-white border-opacity-20 mb-8 max-h-80 overflow-y-auto"
            >
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              ) : chatHistory && chatHistory.length > 0 ? (
                chatHistory.map((chat, index) => (
                  <div key={index} className="flex items-start mb-4">
                    <div className={`p-2 rounded-full mr-3 ${chat.isUser ? 'bg-secondary' : 'bg-white'}`}>
                      <i className={`bx ${chat.isUser ? 'bx-user' : 'bx-bot'} ${chat.isUser ? 'text-white' : 'text-primary'}`}></i>
                    </div>
                    <div className={`py-2 px-4 rounded-lg ${chat.isUser ? 'bg-white bg-opacity-20' : 'bg-white'}`}>
                      <p className={chat.isUser ? 'text-white' : 'text-neutral-800'}>
                        {chat.message}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-white">Ask me anything about Laredo properties!</p>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="relative">
              <Input
                type="text"
                placeholder="Ask about properties in Laredo..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-white bg-opacity-10 text-white placeholder-neutral-300 border border-white border-opacity-20 py-3 px-4 pr-12"
                disabled={sendMessageMutation.isPending}
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white hover:text-secondary"
                disabled={sendMessageMutation.isPending}
              >
                {sendMessageMutation.isPending ? (
                  <i className='bx bx-loader-alt animate-spin text-xl'></i>
                ) : (
                  <i className='bx bx-send text-xl'></i>
                )}
              </Button>
            </form>
            
            <div className="mt-4 text-sm text-white/70">
              <p>Try asking: "Show me affordable properties near Shiloh Drive" or "What's the price of 3720 Flores Ave?"</p>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1560520031-3a4dc4e9de0c?q=80&w=1473&auto=format&fit=crop" 
              alt="AI real estate assistant" 
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
