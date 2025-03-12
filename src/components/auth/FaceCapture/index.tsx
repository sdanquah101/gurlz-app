import React from 'react';
import { useWebcam } from './useWebcam';
import CaptureButton from './CaptureButton';
import PreviewImage from './PreviewImage';

interface FaceCaptureProps {
  onCapture: (image: string) => void;
}

export default function FaceCapture({ onCapture }: FaceCaptureProps) {
  const { webcamRef, isCapturing, setIsCapturing, capture } = useWebcam(onCapture);

  if (!isCapturing) {
    return <CaptureButton onClick={() => setIsCapturing(true)} />;
  }

  return (
    <div className="space-y-4">
      <PreviewImage webcamRef={webcamRef} />
      <div className="flex justify-center space-x-4">
        <button
          onClick={capture}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Capture
        </button>
        <button
          onClick={() => setIsCapturing(false)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}