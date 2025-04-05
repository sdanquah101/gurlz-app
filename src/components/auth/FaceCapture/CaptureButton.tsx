import React from 'react';
import { Camera } from 'lucide-react';

interface CaptureButtonProps {
  onClick: () => void;
}

export default function CaptureButton({ onClick }: CaptureButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
    >
      <Camera className="mr-2" />
      <span>Capture Face Photo</span>
    </button>
  );
}