import React from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Smile } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: any) => void;
  position?: 'top' | 'bottom';
}

export default function EmojiPicker({ onEmojiSelect, position = 'bottom' }: EmojiPickerProps) {
  const [showPicker, setShowPicker] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Close picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setShowPicker(!showPicker)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        type="button"
        aria-label="Open emoji picker"
      >
        <Smile className="w-5 h-5 text-gray-500" />
      </button>

      <AnimatePresence>
        {showPicker && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className={`absolute ${
              position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'
            } right-0 z-50`}
          >
            <div className="shadow-lg rounded-lg overflow-hidden">
              <Picker
                data={data}
                onEmojiSelect={(emoji: any) => {
                  onEmojiSelect(emoji);
                  setShowPicker(false);
                }}
                theme="light"
                previewPosition="none"
                skinTonePosition="none"
                searchPosition="none"
                navPosition="none"
                perLine={8}
                maxFrequentRows={2}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}