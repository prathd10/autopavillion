import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { chatService } from '../services/chatbot/chatService';
import { Link } from 'react-router-dom';
import { ikUrl } from '../lib/imagekit';

const INITIAL_QUICK_ACTIONS = ["Browse Inventory", "Find My Car", "Schedule a Viewing", "Sell My Car"];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      content: "Welcome to Auto Pavilion. Looking for a particular car, or would you like me to help you find something?",
      quickActions: INITIAL_QUICK_ACTIONS
    }
  ]);
  const [chatState, setChatState] = useState({
    flow: 'NORMAL',
    step: 0,
    data: {},
    filters: {}
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const result = await chatService.processMessage(userMessage, chatState);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: result.reply, 
        quickActions: result.quickActions || null 
      }]);
      setChatState(result.state);
    } catch (err) {
      console.error('[Chatbot UI] Error processing message:', err);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "I encountered a minor connection issue. How else can I assist you?" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (actionText) => {
    if (actionText.startsWith('Call ')) {
      window.location.href = 'tel:+918291919393';
      return;
    }

    setMessages(prev => [...prev, { role: 'user', content: actionText }]);
    setIsTyping(true);

    // If Browse Inventory is clicked, we can redirect or search
    if (actionText === "Browse Inventory") {
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "Redirecting you to our inventory collection page...",
      }]);
      setIsOpen(false);
      window.location.href = "/inventory";
      return;
    }

    try {
      const result = await chatService.processMessage(actionText, chatState);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: result.reply, 
        quickActions: result.quickActions || null 
      }]);
      setChatState(result.state);
    } catch (err) {
      console.error('[Chatbot UI] Error processing action:', err);
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: "I had trouble processing that action. How else can I help?" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}>
        {/* Short Notification Message */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 mr-3 bg-zinc-950/95 backdrop-blur-xl border border-white/10 text-[9px] sm:text-[10px] text-zinc-300 font-bold tracking-widest uppercase py-2 px-3.5 rounded-xl shadow-2xl flex items-center gap-2 whitespace-nowrap animate-pulse">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981]" />
          <span>AP Concierge Online</span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="p-4 bg-white hover:bg-zinc-200 text-black rounded-full shadow-[0_8px_35px_rgba(255,255,255,0.2)] hover:scale-110 active:scale-95 transition-all duration-300 border border-white/10 ring-4 ring-white/5"
          title="Chat with Auto Pavilion Showroom Concierge"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      </div>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-[90vw] max-w-sm h-[600px] max-h-[80vh] bg-black/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex flex-col z-50 transition-all duration-500 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 rounded-t-3xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black uppercase text-sm tracking-widest text-white">AP Concierge</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                <span>Concierge Online</span>
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
          {messages.map((msg, idx) => (
            <div key={idx} className="space-y-2">
              <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  
                  {/* Avatar */}
                  <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 ${msg.role === 'user' ? 'ml-2 bg-zinc-800 text-white' : 'mr-2 bg-white text-black'}`}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  {/* Bubble */}
                  <div className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-mulish leading-relaxed max-w-full overflow-hidden ${
                    msg.role === 'user' 
                      ? 'bg-zinc-800 text-white rounded-tr-sm' 
                      : 'bg-white/10 text-zinc-200 rounded-tl-sm border border-white/5'
                  }`}>
                    {typeof msg.content === 'string' ? (
                      <p className="whitespace-pre-line">{msg.content}</p>
                    ) : (
                      <div className="space-y-3 w-full max-w-full">
                        <p>{msg.content.text}</p>
                        <div className="space-y-3 pt-2 w-full max-w-[240px] sm:max-w-[280px]">
                          {msg.content.cars.map(car => (
                            <div 
                              key={car.id} 
                              className="flex flex-col rounded-2xl bg-zinc-950 border border-white/10 hover:border-white/20 transition-all overflow-hidden w-full max-w-full"
                            >
                              <div className="relative h-28 bg-zinc-900 overflow-hidden w-full">
                                <img 
                                  src={car.images?.[0] ? (car.images[0].startsWith('http') ? car.images[0] : ikUrl(car.images[0], { width: 400, height: 300, quality: 70 })) : 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=600&auto=format&fit=crop'} 
                                  alt={car.name} 
                                  className="w-full h-full object-cover block max-w-full" 
                                />
                                {car.status === 'sold' && (
                                  <div className="absolute top-2 right-2 bg-red-600/90 text-white font-black font-heading text-[8px] uppercase tracking-wider px-2 py-0.5 rounded-full">
                                    Sold
                                  </div>
                                )}
                              </div>
                              <div className="p-3 space-y-2 w-full">
                                <div className="min-w-0">
                                  <h4 className="font-heading font-black text-xs uppercase tracking-wide text-white truncate block">
                                    {car.brand} {car.name}
                                  </h4>
                                  <p className="text-[10px] text-zinc-400 font-mulish font-bold uppercase tracking-wider mt-0.5 truncate block">
                                    {car.year} • {car.fuelType} • {car.transmission} • {car.mileageKms}
                                  </p>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-white/5 w-full gap-2">
                                  <span className="text-[11px] font-bold text-white shrink-0">
                                    {car.status === 'sold' ? 'SOLD' : `₹${car.price}`}
                                  </span>
                                  <Link
                                    to={`/inventory/${car.slug}`}
                                    onClick={() => setIsOpen(false)}
                                    className="px-3 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-zinc-200 transition-colors shrink-0"
                                  >
                                    View Car
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Quick Actions (only show for the latest bot message) */}
              {msg.role === 'bot' && msg.quickActions && idx === messages.length - 1 && (
                <div className="flex flex-wrap gap-2 pl-8 pt-1">
                  {msg.quickActions.map((action, actionIdx) => (
                    <button
                      key={actionIdx}
                      onClick={() => handleQuickAction(action)}
                      className="px-3 py-1.5 bg-white/5 border border-white/10 hover:bg-white hover:text-black rounded-full text-[10px] text-zinc-300 font-bold uppercase tracking-wider transition-all"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
             <div className="flex justify-start">
              <div className="flex max-w-[85%] flex-row">
                <div className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 mr-2 bg-white text-black">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white/10 text-zinc-200 rounded-tl-sm border border-white/5 flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                  <span className="text-xs text-zinc-400 font-mulish">Concierge is responding...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/10 bg-black/50">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={chatState.flow !== 'NORMAL' ? "Enter details..." : "Ask about sourcing, inventory, budgets..."}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-white/30 font-mulish"
              disabled={isTyping}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2 bg-white text-black rounded-full disabled:opacity-50 transition-opacity"
            >
              <Send className="w-4 h-4 -ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-2">
             <Link to="/faq" onClick={() => setIsOpen(false)} className="text-[10px] text-zinc-500 hover:text-white uppercase font-bold tracking-widest transition-colors">
               View Full FAQ
             </Link>
          </div>
        </div>

      </div>
    </>
  );
}
