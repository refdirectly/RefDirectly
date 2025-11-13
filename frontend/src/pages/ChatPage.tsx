import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';
import { io, Socket } from 'socket.io-client';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Chat {
  _id: string;
  referralRequest: {
    company: string;
    role: string;
    status: string;
  };
  userRole: 'seeker' | 'referrer';
  lastMessage: {
    text: string;
    createdAt: Date;
  } | null;
  unreadCount?: number;
}

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userRole, setUserRole] = useState<'seeker' | 'referrer'>('seeker');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }
    
    setUser(JSON.parse(userData));

    // Initialize socket
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const newSocket = io(API_URL, {
      withCredentials: true,
      auth: { token }
    });
    setSocket(newSocket);

    // Fetch user's chats
    fetch(`${API_URL}/api/chat/chats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setChats(data.chats || []);
        setLoading(false);
        
        // Auto-select from URL param
        const roomId = searchParams.get('room');
        if (roomId && data.chats?.some((c: Chat) => c._id === roomId)) {
          setSelectedChat(roomId);
          const chat = data.chats.find((c: Chat) => c._id === roomId);
          if (chat) setUserRole(chat.userRole);
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

    return () => {
      newSocket.close();
    };
  }, [navigate, searchParams]);

  const filteredChats = chats.filter(chat => 
    chat.referralRequest.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.referralRequest.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedChatData = chats.find(c => c._id === selectedChat);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow pt-24 md:pt-32 pb-8">
        <div className="container mx-auto px-4 h-[calc(100vh-200px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden h-full flex flex-col"
          >
            <div className="flex h-full">
              {/* Chat List Sidebar */}
              <div className="w-80 lg:w-96 border-r border-gray-200 bg-gradient-to-b from-gray-50 to-white flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-brand-purple via-brand-magenta to-brand-teal text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        Messages
                      </h2>
                      <p className="text-sm text-white/80 mt-1">{filteredChats.length} active {filteredChats.length === 1 ? 'conversation' : 'conversations'}</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <span className="text-xl font-bold">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                  </div>
                  
                  {/* Search */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 pl-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                    />
                    <svg className="absolute left-4 top-3.5 w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Chat List */}
                <div className="flex-1 overflow-y-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
                        <p className="text-sm text-gray-500 mt-2">Loading chats...</p>
                      </div>
                    </div>
                  ) : filteredChats.length === 0 ? (
                    <div className="flex items-center justify-center h-full p-6">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center text-gray-400"
                      >
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-6 inline-block mb-4">
                          <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <p className="font-bold text-gray-700 text-lg">No conversations yet</p>
                        <p className="text-sm mt-2 text-gray-500">Accept a referral request to start chatting</p>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {filteredChats.map((chat, idx) => (
                        <motion.button
                          key={chat._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedChat(chat._id);
                            setUserRole(chat.userRole);
                          }}
                          className={`w-full p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all text-left relative ${
                            selectedChat === chat._id ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-l-brand-purple shadow-md' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                                {chat.referralRequest.company.charAt(0)}
                              </div>
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-bold text-gray-900 truncate">
                                  {chat.referralRequest.company}
                                </h3>
                                {chat.unreadCount && chat.unreadCount > 0 && (
                                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {chat.unreadCount}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 truncate mb-1">
                                {chat.referralRequest.role}
                              </p>
                              {chat.lastMessage && (
                                <p className="text-xs text-gray-400 truncate">
                                  {chat.lastMessage.text}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold shadow-sm ${
                                  chat.referralRequest.status === 'accepted' ? 'bg-green-100 text-green-700' :
                                  chat.referralRequest.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                  chat.referralRequest.status === 'completed' ? 'bg-purple-100 text-purple-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {chat.referralRequest.status === 'accepted' ? '✅ Accepted' :
                                   chat.referralRequest.status === 'in_progress' ? '🔄 In Progress' :
                                   chat.referralRequest.status === 'completed' ? '✨ Completed' :
                                   chat.referralRequest.status}
                                </span>
                                <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-600">
                                  {chat.userRole === 'seeker' ? '👤 You' : '🤝 Referrer'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Interface */}
              <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
                {(selectedChat || searchParams.get('room')) && socket ? (
                  <ChatInterface
                    roomId={selectedChat || searchParams.get('room') || ''}
                    userRole={userRole}
                    socket={socket}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center text-gray-400 max-w-md">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-8 inline-block mb-6">
                          <svg className="w-24 h-24 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">Select a Conversation</h3>
                        <p className="text-gray-500">Choose a chat from the sidebar to start messaging with {user?.role === 'seeker' ? 'your referrer' : 'the job seeker'}</p>
                      </motion.div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
