import React from 'react';
import Webcam from 'react-webcam';

interface PreviewImageProps {
  webcamRef: React.RefObject<Webcam>;
}

export default function PreviewImage({ webcamRef }: PreviewImageProps) {
  return (
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      className="w-full rounded-lg"
    />
  );
}