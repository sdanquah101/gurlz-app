import React, { useRef, useCallback, useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import Webcam from 'react-webcam';
import { supabase } from '../../lib/supabase';
import Button from '../common/Button';

interface FaceVerificationProps {
  userId: string;
  onVerificationComplete: (success: boolean) => void;
}

export default function FaceVerification({ userId, onVerificationComplete }: FaceVerificationProps) {
  const webcamRef = useRef<Webcam>(null);
  const [capturing, setCapturing] = useState(false);
  const [imageData, setImageData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCapture = () => {
    setCapturing(true);
    setError(null);
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setImageData(imageSrc);
        handleCapture(imageSrc);
      }
    }
  }, [webcamRef]);

  const handleCapture = async (imageSrc: string) => {
    try {
      setLoading(true);
      setError(null);

      // Convert base64 to blob
      const blob = base64ToBlob(imageSrc);
      
      // Upload image to face-verification bucket
      const fileName = `${userId}/${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('face-verification')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error('Failed to upload image');
      }

      // Get the public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('face-verification')
        .getPublicUrl(fileName);

      // Create face verification record
      const { error: verificationError } = await supabase
        .from('face_verifications')
        .insert({
          user_id: userId,
          face_image_url: publicUrl,
          verification_status: 'pending'
        });

      if (verificationError) {
        console.error('Verification record error:', verificationError);
        throw new Error('Failed to create verification record');
      }

      // Simulate verification process
      await simulateVerification(userId);

      onVerificationComplete(true);
    } catch (err: any) {
      console.error('Face verification error:', err);
      setError(err.message || 'Failed to complete face verification');
      onVerificationComplete(false);
    } finally {
      setLoading(false);
      setCapturing(false);
    }
  };

  const simulateVerification = async (userId: string) => {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update verification status
      const { error } = await supabase
        .from('face_verifications')
        .update({ 
          verification_status: 'verified', 
          verified_at: new Date().toISOString() 
        })
        .eq('user_id', userId)
        .single();

      if (error) throw error;
    } catch (error) {
      console.error('Verification simulation error:', error);
      throw new Error('Failed to complete verification');
    }
  };

  const base64ToBlob = (base64: string) => {
    try {
      const byteString = atob(base64.split(',')[1]);
      const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      return new Blob([ab], { type: mimeString });
    } catch (error) {
      console.error('Base64 to Blob conversion error:', error);
      throw new Error('Failed to process image');
    }
  };

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user"
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
        {capturing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="w-12 h-12 text-gray-400" />
          </div>
        )}

        {imageData && (
          <motion.img
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            src={imageData}
            alt="Captured"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
      </div>

      <div className="flex justify-center space-x-4">
        {!loading && (
          <>
            {!capturing && !imageData && (
              <Button onClick={startCapture} className="w-full">
                <Camera className="mr-2" size={20} />
                Start Camera
              </Button>
            )}
            {capturing && !imageData && (
              <Button onClick={capture} className="w-full">
                <Camera className="mr-2" size={20} />
                Take Photo
              </Button>
            )}
            {imageData && (
              <Button onClick={startCapture} className="w-full">
                <RefreshCw className="mr-2" size={20} />
                Retake Photo
              </Button>
            )}
          </>
        )}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto" />
          <p className="text-sm text-gray-500 mt-2">Verifying...</p>
        </div>
      )}
    </div>
  );
}