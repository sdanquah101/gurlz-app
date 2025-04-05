import { useCallback, useRef, useState } from 'react';
import Webcam from 'react-webcam';

export function useWebcam(onCapture: (image: string) => void) {
  const webcamRef = useRef<Webcam>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        onCapture(imageSrc);
        setIsCapturing(false);
      }
    }
  }, [onCapture]);

  return {
    webcamRef,
    isCapturing,
    setIsCapturing,
    capture
  };
}