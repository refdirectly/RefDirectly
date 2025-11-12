import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Paperclip, Smile, Send, Check, CheckCheck, Image, File, X } from 'lucide-react';

interface Message {
  _id?: string;
  senderRole: 'seeker' | 'referrer' | 'system';
  text: string;
  createdAt: Date;
  read?: boolean;
  attachment?: { type: string; url: string; name: string };
}

interface ChatInterfaceProps {
  roomId: string;
  userRole: 'seeker' | 'referrer';
  socket: any;
  onClose?: () => void;
}

export default function ChatInterface({ roomId, userRole, socket, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '✨', '💯', '🙌', '👏', '💪', '🚀', '⭐', '✅', '💼', '📝', '📧', '📞', '💡', '🎯'];

  useEffect(() => {
    if (!socket) return;

    socket.emit('join_chat_room', roomId);
    setIsConnected(true);
    
    socket.on('connect', () => {
      socket.emit('join_chat_room', roomId);
      setIsConnected(true);
    });
    
    socket.on('disconnect', () => setIsConnected(false));

    const token = localStorage.getItem('token');
    fetch(`http://localhost:3001/api/chat/${roomId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setMessages(data.messages || []))
      .catch(console.error);

    socket.on('incoming_chat_message', (msg: Message) => {
      setMessages(prev => {
        const exists = prev.some(m => m.text === msg.text && m.senderRole === msg.senderRole && 
          Math.abs(new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime()) < 1000);
        if (exists) return prev;
        return [...prev, msg];
      });
    });

    socket.on('typing', ({ isTyping: typing }: { isTyping: boolean }) => {
      setIsTyping(typing);
    });

    return () => {
      socket.off('incoming_chat_message');
      socket.off('typing');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, [socket, roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if ((!inputText.trim() && !selectedFile) || !socket) return;

    socket.emit('chat_message', {
      roomId,
      text: inputText.trim() || `Sent ${selectedFile?.name}`,
      senderRole: userRole
    });

    setInputText('');
    setSelectedFile(null);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden rounded-2xl shadow-xl border border-gray-200">
      <div className="flex-1 overflow-y-auto p-8 space-y-5 bg-white">
        <AnimatePresence>
          {messages.map((msg, idx) => {
            const isOwn = msg.senderRole === userRole;
            const isSystem = msg.senderRole === 'system';

            if (isSystem) {
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center my-4">
                  <div className="bg-gray-100 text-gray-600 text-xs px-4 py-2 rounded-full font-medium shadow-sm">{msg.text}</div>
                </motion.div>
              );
            }

            return (
              <motion.div key={idx} initial={{ opacity: 0, x: isOwn ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className={`flex gap-3 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                {!isOwn && (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg">
                    {userRole === 'seeker' ? 'R' : 'S'}
                  </div>
                )}
                <div className="max-w-[70%]">
                  <div className={`px-5 py-3.5 rounded-2xl shadow-sm transition-all ${isOwn ? 'bg-gradient-to-r from-brand-purple to-brand-magenta text-white rounded-br-sm' : 'bg-gray-50 text-gray-900 border border-gray-200 rounded-bl-sm'}`}>
                    {msg.attachment && (
                      <div className="mb-2">
                        {msg.attachment.type === 'image' ? (
                          <img src={msg.attachment.url} alt={msg.attachment.name} className="rounded-lg max-w-full h-auto" />
                        ) : (
                          <div className={`flex items-center gap-2 p-2 rounded-lg ${isOwn ? 'bg-white/20' : 'bg-gray-100'}`}>
                            <File className="h-5 w-5" />
                            <span className="text-sm font-medium">{msg.attachment.name}</span>
                          </div>
                        )}
                      </div>
                    )}
                    <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                  </div>
                  <div className={`flex items-center gap-2 mt-1.5 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <p className="text-[11px] text-gray-400 font-medium">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {isOwn && (
                      <span className="text-blue-400">
                        {msg.read ? <CheckCheck className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                      </span>
                    )}
                  </div>
                </div>
                {isOwn && (
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg">You</div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-lg">
              {userRole === 'seeker' ? 'R' : 'S'}
            </div>
            <div className="bg-gray-50 border border-gray-200 shadow-sm px-5 py-3.5 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="bg-gray-50 border-t border-gray-200 p-6">
        {selectedFile && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
            {selectedFile.type.startsWith('image/') ? <Image className="h-5 w-5 text-blue-600" /> : <File className="h-5 w-5 text-blue-600" />}
            <span className="text-sm text-gray-700 flex-1 truncate">{selectedFile.name}</span>
            <button onClick={() => setSelectedFile(null)} className="text-red-500 hover:text-red-700">
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        )}
        
        <div className="flex items-end gap-2">
          <div className="flex gap-2">
            <button onClick={() => fileInputRef.current?.click()} className="p-3.5 rounded-xl bg-white hover:bg-brand-purple hover:text-white text-gray-600 transition-all border border-gray-300 hover:border-brand-purple shadow-sm hover:shadow-md" title="Attach file">
              <Paperclip className="h-5 w-5" />
            </button>
            <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" accept="image/*,.pdf,.doc,.docx" />
            
            <div className="relative">
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-3.5 rounded-xl bg-white hover:bg-brand-purple hover:text-white text-gray-600 transition-all border border-gray-300 hover:border-brand-purple shadow-sm hover:shadow-md" title="Add emoji">
                <Smile className="h-5 w-5" />
              </button>
              
              {showEmojiPicker && (
                <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-3 grid grid-cols-5 gap-2 z-10">
                  {emojis.map((emoji, i) => (
                    <button key={i} onClick={() => handleEmojiClick(emoji)} className="text-2xl hover:scale-125 transition-transform p-1 hover:bg-gray-100 rounded">
                      {emoji}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
          
          <div className="flex-1 relative">
            <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()} placeholder="Type your message..." className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition-all text-gray-900 placeholder-gray-400 shadow-sm" />
          </div>
          
          <button onClick={handleSend} disabled={!inputText.trim() && !selectedFile} className="bg-gradient-to-r from-brand-purple to-brand-magenta text-white px-7 py-4 rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] flex items-center gap-2.5 shadow-lg" title="Send message">
            <Send className="h-5 w-5" />
            <span className="hidden sm:inline font-bold">Send</span>
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-4 text-center flex items-center justify-center gap-2">
          <span>Press</span>
          <kbd className="px-2.5 py-1 bg-white border border-gray-300 rounded-md text-xs font-mono shadow-sm">Enter</kbd>
          <span>to send</span>
        </p>
      </div>
    </div>
  );
}
