import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ChatList from '../components/chat/ChatList';
import ChatRoom from '../components/chat/ChatRoom';

export default function Chat() {
  return (
    <Routes>
      <Route path="/" element={<ChatList />} />
      <Route path=":chatId/*" element={<ChatRoom />} />
      {/* Catch any other routes and redirect to the main chat list */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}