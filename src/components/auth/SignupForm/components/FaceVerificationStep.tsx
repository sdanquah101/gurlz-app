import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFaceVerification } from '../../../../hooks/useFaceVerification';
import { useAuthStore } from '../../../../store/authStore';
import Button from '../../../common/Button';

interface FaceVerificationStepProps {
  userId: string;
  onComplete: () => void;
}

export function FaceVerificationStep({ userId, onComplete }: FaceVerificationStepProps) {
  const navigate = useNavigate();
  const { submitVerification, submitting, error: hookError } = useFaceVerification();
  const [imageData, setImageData] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [processingComplete, setProcessingComplete] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleCapture = async (imageSrc: string) => {
    setImageData(imageSrc);
    setShowCamera(false);
    // Clear any previous errors when capturing a new image
    setLocalError(null);
  };

  const handleSubmit = async () => {
    if (!imageData) {
      setLocalError("Please capture an image first");
      return;
    }

    // Clear any previous errors
    setLocalError(null);

    try {
      console.log("Submitting face verification for user:", userId);
      const success = await submitVerification(userId, imageData);
      
      console.log("Face verification submission result:", success);
      
      if (success) {
        // This is the critical part - make sure we're properly handling success
        console.log("Face verification successful, proceeding to next step");
        setProcessingComplete(true);
        onComplete();
        return; // Important to return early to avoid executing more code
      } else {
        // This shouldn't happen if the hook returned true
        console.error("Verification returned false but no error was thrown");
        setLocalError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      console.error("Exception in handleSubmit:", err);
      setLocalError(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  // Calculate the error to display - prioritize local errors over hook errors
  const displayError = localError || hookError;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h3 className="text-xl font-semibold text-primary mb-2">Face Verification Required</h3>
        <p className="text-gray-600">
          To ensure community safety, we require face verification for all users.
        </p>
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
        <div className="flex items-start">
          <AlertCircle className="text-yellow-400 mt-0.5 mr-3" />
          <div>
            <h4 className="text-sm font-medium text-yellow-800">Limited Access Notice</h4>
            <p className="mt-1 text-sm text-yellow-700">
              Your account will have limited access until both your email is verified and your face verification is approved by our team.
              This usually takes 24-48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* Processing complete message */}
      {processingComplete ? (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded">
          <div className="flex items-start">
            <div>
              <h4 className="text-sm font-medium text-green-800">Verification Submitted</h4>
              <p className="mt-1 text-sm text-green-700">
                Your face verification has been submitted successfully. Please proceed to verify your email to complete the registration process.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Image Capture Area */
        <div className="space-y-4">
          {!imageData && !showCamera && (
            <Button 
              onClick={() => setShowCamera(true)}
              className="w-full"
            >
              <Camera className="mr-2" size={20} />
              Take Photo
            </Button>
          )}

          {showCamera && (
            <WebcamCapture onCapture={handleCapture} onCancel={() => setShowCamera(false)} />
          )}

          {imageData && (
            <div className="relative">
              <img 
                src={imageData} 
                alt="Verification" 
                className="w-full rounded-lg"
              />
              <Button 
                variant="outline"
                size="sm"
                onClick={() => setImageData(null)}
                className="absolute top-2 right-2"
              >
                Retake
              </Button>
            </div>
          )}

          {displayError && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {displayError}
            </div>
          )}

          {imageData && (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full"
            >
              {submitting ? 'Submitting...' : 'Submit for Verification'}
            </Button>
          )}
        </div>
      )}

      {/* Access Information */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">What to expect:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• You'll need to verify your email after this step</li>
          <li>• Your face verification will be reviewed by our team</li>
          <li>• Full access will be granted after both verifications are complete</li>
        </ul>
      </div>

      {/* Next step button */}
      {processingComplete && (
        <Button 
          onClick={onComplete}
          className="w-full"
        >
          Continue to Email Verification
        </Button>
      )}
    </motion.div>
  );
}

// WebcamCapture Component
interface WebcamCaptureProps {
  onCapture: (image: string) => void;
  onCancel: () => void;
}

function WebcamCapture({ onCapture, onCancel }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    async function setupCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    }
    
    setupCamera();
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        onCapture(canvas.toDataURL('image/jpeg'));
      }
    }
  };

  return (
    <div className="space-y-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-lg"
      />
      <div className="flex justify-center space-x-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={capture}>
          Capture
        </Button>
      </div>
    </div>
  );
}