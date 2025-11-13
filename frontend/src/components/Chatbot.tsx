import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to RefferUs! I\'m here to assist you with job referrals, pricing, and platform features. How may I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('hi') || lowerInput.includes('hello') || lowerInput.includes('hey')) {
      return 'Hello! Thank you for reaching out. I can help you with job referrals, platform features, pricing, and more. What would you like to know?';
    } else if (lowerInput.includes('referral') || lowerInput.includes('refer')) {
      return 'To receive a referral:\n\n1. Click "Find a Referrer" in the navigation\n2. Search for your target company\n3. Our AI matches you with verified employees\n4. Connect and request your referral\n\nAll referrers are verified professionals at their respective companies.';
    } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('pricing')) {
      return 'Our pricing structure:\n\n• Basic Referrals: Starting at $50\n• Premium Plans: Unlimited referrals with priority matching\n• Secure Escrow: All payments protected until referral confirmed\n\nWould you like to learn more about our Premium membership?';
    } else if (lowerInput.includes('how') || lowerInput.includes('work')) {
      return 'RefferUs streamlines the referral process:\n\n1. Browse 500+ companies with verified referrers\n2. AI-powered matching connects you instantly\n3. Secure chat for discussing opportunities\n4. Escrow-protected payments\n5. Get referred and land your dream job\n\nJoin 50,000+ professionals already using RefferUs!';
    } else if (lowerInput.includes('premium')) {
      return 'Premium Membership Benefits:\n\n✓ Unlimited referrals\n✓ Priority AI matching\n✓ Resume optimization\n✓ Dedicated support team\n✓ Advanced analytics\n✓ Early access to new features\n\nUpgrade today to accelerate your job search!';
    } else if (lowerInput.includes('safe') || lowerInput.includes('secure') || lowerInput.includes('trust')) {
      return 'Your security is our priority:\n\n🔒 Escrow-protected payments\n✓ SOC 2 & GDPR compliant\n🛡️ SSL encrypted communications\n✅ Verified referrers only\n⭐ 4.9/5 user rating\n\nAll transactions are fully protected until referral completion.';
    } else {
      return 'I\'m here to assist you with:\n\n• How referrals work\n• Pricing and plans\n• Premium features\n• Security and trust\n• Platform navigation\n\nPlease let me know what you\'d like to explore!';
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-4 left-4 sm:left-auto sm:right-6 sm:w-96 h-[500px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200"
          >
            <div className="bg-gradient-primary text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <Bot className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">RefDirectly Assistant</h3>
                  <p className="text-xs opacity-90">Online</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3 sm:px-4 py-2 ${
                      message.sender === 'user'
                        ? 'bg-gradient-primary text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.text}</p>
                    <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 sm:p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-purple text-gray-900"
                />
                <button
                  type="button"
                  onClick={handleSend}
                  aria-label="Send message"
                  className="bg-gradient-primary text-white p-2 rounded-full hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 h-12 w-12 sm:h-14 sm:w-14 bg-gradient-primary text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:shadow-xl transition-shadow"
      >
        {isOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />}
      </motion.button>
    </>
  );
};

export default Chatbot;
