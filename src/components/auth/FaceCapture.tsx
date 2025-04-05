import React, { useRef, useState } from 'react';
import { Camera, X } from 'lucide-react';
import Button from '../common/Button';

interface FaceCaptureProps {
  onCapture: (image: string) => void;
}

export default function FaceCapture({ onCapture }: FaceCaptureProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsCapturing(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCapturing(false);
  };

  const capture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        onCapture(imageData);
        stopCamera();
      }
    }
  };

  if (!isCapturing) {
    return (
      <button
        onClick={startCamera}
        className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors"
      >
        <Camera className="mr-2" />
        <span>Capture Face Photo</span>
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg"
        />
        <canvas ref={canvasRef} className="hidden" />
        <button
          onClick={stopCamera}
          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex justify-center space-x-4">
        <Button onClick={capture} className="px-6">
          Capture
        </Button>
        <Button
          variant="outline"
          onClick={stopCamera}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}