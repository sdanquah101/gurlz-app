import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameInvite } from '../../types/games';
import Button from '../common/Button';

interface GameInviteModalProps {
  invite: GameInvite;
  onAccept: () => void;
  onReject: () => void;
}

export default function GameInviteModal({ invite, onAccept, onReject }: GameInviteModalProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      >
        <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
          <h3 className="text-xl font-semibold text-primary mb-4">Game Invitation</h3>
          <p className="text-gray-600 mb-6">
            {invite.from.username} has invited you to play {invite.gameType}
          </p>
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onReject}>
              Decline
            </Button>
            <Button onClick={onAccept}>
              Accept
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}