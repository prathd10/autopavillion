import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { FAQS } from '../data/faqs';
import { useCars } from '../hooks/useCars';
import { Link } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini only if key is present
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Welcome to Auto Pavilion! I'm your virtual concierge. How can I assist you with our premium inventory or sourcing services today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { cars } = useCars();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isTyping]);

  // Local Intent & Fallback Engine
  const generateResponse = async (query) => {
    const lowerQuery = query.toLowerCase();

    // 1. Basic Greeting
    if (/^(hi|hello|hey|greetings)\b/.test(lowerQuery)) {
      return "Hello! Are you looking to explore our current inventory, or would you like to know more about our Bespoke Sourcing service?";
    }

    // 2. FAQ Matcher (Score-based)
    let bestMatch = null;
    let highestScore = 0;

    FAQS.forEach(faq => {
      let score = 0;
      faq.keywords.forEach(keyword => {
        if (lowerQuery.includes(keyword.toLowerCase())) {
          score += 1.5; // Weight exact phrase matches heavily
        }
      });
      if (score > highestScore) {
        highestScore = score;
        bestMatch = faq;
      }
    });

    // If we have a strong match from our rich local DB, return it immediately.
    if (bestMatch && highestScore >= 1.5) {
      return bestMatch.answer;
    }

    // 3. Advanced Local Inventory Search (Brand, Body Type, Budget)
    const brandKeywords = ["ferrari", "lamborghini", "porsche", "mercedes", "amg", "rolls-royce", "bentley", "aston martin", "mclaren", "land rover", "range rover"];
    const bodyKeywords = ["suv", "sedan", "coupe", "convertible", "sports"];
    
    let requestedBrand = brandKeywords.find(brand => lowerQuery.includes(brand));
    let requestedBody = bodyKeywords.find(body => lowerQuery.includes(body));
    
    // Simple budget extraction (e.g., "under 3 cr", "less than 20000000")
    let maxBudget = null;
    if (lowerQuery.includes('under') || lowerQuery.includes('less than') || lowerQuery.includes('budget')) {
      const numMatch = lowerQuery.match(/(\d+(?:\.\d+)?)\s*(cr|crore|lakh)/);
      if (numMatch) {
        let val = parseFloat(numMatch[1]);
        if (numMatch[2].startsWith('cr')) maxBudget = val * 10000000;
        else if (numMatch[2] === 'lakh') maxBudget = val * 100000;
      }
    }

    if (requestedBrand || requestedBody || maxBudget || lowerQuery.includes('car') || lowerQuery.includes('inventory') || lowerQuery.includes('show me')) {
      let matchingCars = cars;
      
      // Filter Brand
      if (requestedBrand) {
        if (requestedBrand === 'mercedes' || requestedBrand === 'amg') requestedBrand = 'mercedes-amg';
        if (requestedBrand === 'range rover') requestedBrand = 'land rover';
        matchingCars = matchingCars.filter(c => c.brand.toLowerCase() === requestedBrand);
      }
      
      // Filter Body
      if (requestedBody) {
        matchingCars = matchingCars.filter(c => c.bodyType?.toLowerCase() === requestedBody);
      }

      // Filter Budget
      if (maxBudget) {
        matchingCars = matchingCars.filter(c => c.priceNumeric <= maxBudget);
      }

      if (matchingCars.length > 0) {
        let msgText = `I found some magnificent vehicles`;
        if (requestedBrand) msgText += ` by ${requestedBrand.toUpperCase()}`;
        if (requestedBody) msgText += ` (${requestedBody})`;
        if (maxBudget) msgText += ` within your budget`;
        msgText += `:`;
        
        return {
          text: msgText,
          cars: matchingCars.slice(0, 3)
        };
      } else if (requestedBrand || requestedBody || maxBudget) {
        // Fallback if specific filters yield no results
        return `Currently, we don't have exact public matches for that specific criteria in our showroom. However, our Bespoke Concierge team specializes in acquiring these exact models through our private network. Would you like to schedule a call?`;
      }
    }

    // 4. Gemini API Fallback (The "Live Deep Study" fallback)
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        // We inject the deep context of Auto Pavilion here.
        const systemPrompt = `
          You are the elite digital concierge for Auto Pavilion India, a premier pre-owned luxury vehicle dealership in Mumbai.
          Tone: Professional, luxurious, knowledgeable, and discreet.
          Knowledge base:
          - You sell 100% non-accident cars.
          - Every car gets a 251-Point Diagnostic Audit.
          - You offer Bespoke Sourcing (finding cars not in stock).
          - You offer financing through top Indian banks.
          - You deliver pan-India on flatbeds.
          - Showroom: Santacruz West, Mumbai.
          
          Current Public Inventory Details for context (do NOT list them all, just use to answer if asked):
          ${cars.map(c => `${c.year} ${c.brand} ${c.model} (₹${c.price})`).join(', ')}

          User Query: ${query}
          
          Respond conversationally and concisely (under 3 sentences) to the user's query based on this deep knowledge.
        `;

        const result = await model.generateContent(systemPrompt);
        const responseText = result.response.text();
        return responseText;
      } catch (error) {
        console.error("Gemini Fallback Error:", error);
        return "I apologize, but my advanced concierge system is currently updating. You can view our full FAQs or contact our team directly at +91 82 9191 9393.";
      }
    }

    // 5. Ultimate Default Fallback (If no API key and local fails)
    return "I'm not entirely sure about that specific request. For complex inquiries, I recommend checking our FAQ page or scheduling a viewing appointment with one of our human concierges at +91 82 9191 9393.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setInput('');
    setIsTyping(true);

    // Call the engine (which may be async if hitting Gemini)
    const response = await generateResponse(userMessage);
    
    setMessages(prev => [...prev, { role: 'bot', content: response }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 bg-white text-black rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 z-50 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'}`}
        title="Chat with Auto Pavilion"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

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
                <span>Online</span>
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
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                
                {/* Avatar */}
                <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-1 ${msg.role === 'user' ? 'ml-2 bg-zinc-800 text-white' : 'mr-2 bg-white text-black'}`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble */}
                <div className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-mulish leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-zinc-800 text-white rounded-tr-sm' 
                    : 'bg-white/10 text-zinc-200 rounded-tl-sm border border-white/5'
                }`}>
                  {typeof msg.content === 'string' ? (
                    <p>{msg.content}</p>
                  ) : (
                    <div className="space-y-3">
                      <p>{msg.content.text}</p>
                      <div className="space-y-2 pt-2">
                        {msg.content.cars.map(car => (
                          <Link 
                            key={car.id} 
                            to={`/inventory`}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center space-x-3 p-2 rounded-xl bg-black border border-white/10 hover:border-white/30 transition-colors group"
                          >
                            <div className="w-12 h-12 rounded-lg bg-zinc-900 overflow-hidden shrink-0">
                              <img src={car.gallery?.[0] || 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=600&auto=format&fit=crop'} alt={car.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div>
                              <p className="font-bold text-white text-[10px] sm:text-xs line-clamp-1">{car.name}</p>
                              <p className="text-zinc-400 font-mono text-[10px]">₹{car.price}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
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
                  <span className="text-xs text-zinc-400">Concierge is typing...</span>
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
              placeholder="Ask about sourcing, inventory, budgets..."
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
