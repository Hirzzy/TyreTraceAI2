
"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Bot, User, X, Loader2 } from "lucide-react";
import { tyreTraceChat, TyreTraceChatInput, TyreTraceChatOutput } from "@/ai/flows/tyretrace-chatbot-flow";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  from: 'user' | 'bot';
  text: string;
}

export function AiChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { from: 'bot', text: 'Bonjour ! Comment puis-je vous aider à optimiser votre flotte ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessageText = input;
    setMessages(prev => [...prev, { from: 'user', text: userMessageText }]);
    setInput('');
    setIsLoading(true);

    try {
      const result: TyreTraceChatOutput = await tyreTraceChat({ userMessage: userMessageText });
      setMessages(prev => [...prev, { from: 'bot', text: result.botResponse }]);
    } catch (error) {
      console.error("Erreur de l'IA Chatbot:", error);
      toast({
        variant: "destructive",
        title: "Erreur Assistant IA",
        description: "Désolé, une erreur est survenue lors de la communication avec l'assistant.",
      });
      setMessages(prev => [...prev, { from: 'bot', text: 'Désolé, une erreur est survenue. Veuillez réessayer.' }]);
    } finally {
      setIsLoading(false);
    }
  };
    
  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport="true"]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)} 
        className="fixed bottom-8 right-8 bg-primary text-primary-foreground w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform z-50"
        aria-label="Ouvrir l'assistant IA"
        size="icon"
      >
        <MessageSquare size={28} />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-8 right-8 w-96 h-[70vh] max-h-[600px] shadow-2xl flex flex-col z-50 border-border bg-card text-card-foreground">
      <CardHeader className="p-4 bg-muted/50 rounded-t-lg flex flex-row justify-between items-center">
        <div className="flex items-center gap-2">
            <Bot size={20} className="text-primary"/>
            <CardTitle className="text-base font-semibold">Assistant IA TyreTrace</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Fermer l'assistant IA">
            <X size={20} />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-[85%] text-sm shadow ${msg.from === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-lg bg-muted text-muted-foreground text-sm shadow flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                  <span>...</span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder="Posez votre question..." 
            className="flex-1 focus:ring-primary"
            disabled={isLoading}
          />
          <Button onClick={handleSend} className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading} size="icon" aria-label="Envoyer le message">
            <Send size={20} />
          </Button>
        </div>
      </div>
    </Card>
  );
}
