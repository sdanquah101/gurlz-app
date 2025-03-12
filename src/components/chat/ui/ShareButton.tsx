import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Link2, Twitter, Facebook, Copy, Check } from 'lucide-react';

interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onShare?: () => void;
}

export default function ShareButton({
  url,
  title = 'Check this out!',
  text = '',
  size = 'md',
  className = '',
  onShare
}: ShareButtonProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'p-1.5',
      icon: 16,
      text: 'text-xs'
    },
    md: {
      button: 'p-2',
      icon: 20,
      text: 'text-sm'
    },
    lg: {
      button: 'p-2.5',
      icon: 24,
      text: 'text-base'
    }
  };

  const handleShare = async (platform?: string) => {
    try {
      if (platform) {
        let shareUrl = '';
        switch (platform) {
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
            break;
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
          default:
            break;
        }
        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      } else if (navigator.share) {
        await navigator.share({
          title,
          text,
          url
        });
      }
      onShare?.();
      setShowOptions(false);
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setShowOptions(false);
      onShare?.();
    } catch (error) {
      console.error('Error copying link:', error);
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowOptions(!showOptions)}
        className={`rounded-full ${sizeConfig[size].button} 
          text-gray-500 hover:text-gray-700 hover:bg-gray-100
          transition-colors ${className}`}
      >
        <Share2 size={sizeConfig[size].icon} />
      </motion.button>

      <AnimatePresence>
        {showOptions && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowOptions(false)}
            />

            {/* Share options menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute bottom-full right-0 mb-2 p-2 bg-white 
                rounded-xl shadow-lg z-50 min-w-[200px]"
            >
              {/* Share options */}
              <div className="space-y-1">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center w-full px-3 py-2 text-left 
                    hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-green-500 mr-2" />
                      <span className="text-green-500">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Link2 size={16} className="mr-2" />
                      <span>Copy link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleShare('twitter')}
                  className="flex items-center w-full px-3 py-2 text-left 
                    hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Twitter size={16} className="mr-2 text-blue-400" />
                  <span>Share on Twitter</span>
                </button>

                <button
                  onClick={() => handleShare('facebook')}
                  className="flex items-center w-full px-3 py-2 text-left 
                    hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Facebook size={16} className="mr-2 text-blue-600" />
                  <span>Share on Facebook</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
    </div>
  );
}