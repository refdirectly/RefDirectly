import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';
import { io, Socket } from 'socket.io-client';

import Header from '../components/Header';

export default function ReferrerChatPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatInfo, setChatInfo] = useState<any>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roomId = searchParams.get('room');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !roomId) {
      navigate('/referrer/dashboard');
      return;
    }

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    fetch(`${API_URL}/api/referrals/${roomId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setChatInfo(data))
      .catch(console.error);

    const newSocket = io(API_URL, {
      withCredentials: true,
      auth: { token }
    });
    setSocket(newSocket);
    setLoading(false);

    return () => {
      newSocket.close();
    };
  }, [navigate, roomId]);

  if (loading || !roomId || !socket) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-purple via-brand-magenta to-brand-teal">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-r-transparent mx-auto mb-4"></div>
          <p className="text-white font-semibold">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/referrer/dashboard')} className="text-gray-600 hover:text-brand-purple transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{chatInfo?.company || 'Chat'}</h1>
              <p className="text-sm text-gray-500">{chatInfo?.role || 'Conversation'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Active</span>
          </div>
        </div>
      </div>
      <main className="flex-grow overflow-hidden">
        <div className="h-full max-w-6xl mx-auto">
          <ChatInterface roomId={roomId} userRole="referrer" socket={socket} />
        </div>
      </main>
    </div>
  );
}
