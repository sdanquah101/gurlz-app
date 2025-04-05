import { useState } from 'react';
import { supabase } from './../lib/supabase';

export function useFaceVerification() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitVerification = async (userId: string, imageData: string): Promise<boolean> => {
    setSubmitting(true);
    setError(null);

    try {
      // Convert data URL to blob
      const response = await fetch(imageData);
      const blob = await response.blob();

      // Create a storage reference
      const fileExt = 'jpg';
      const fileName = `${userId}_verification_${Date.now()}.${fileExt}`;
      const filePath = `face_verifications/${fileName}`;

      // Upload to storage
      let uploadedPath = filePath;
      let uploadSuccess = false;
      
      // Upload to face-verification bucket
      try {
        const { error: uploadError } = await supabase.storage
          .from('face-verification')
          .upload(filePath, blob, { upsert: true });
          
        if (!uploadError) {
          uploadSuccess = true;
          console.log("Upload successful to face-verification bucket");
        } else {
          console.error("Upload error:", uploadError);
        }
      } catch (uploadErr) {
        console.error("Exception in upload:", uploadErr);
      }

      // If storage upload failed, throw error
      if (!uploadSuccess) {
        throw new Error("Failed to upload verification image");
      }

      // Store in user metadata for redundancy
      try {
        await supabase.auth.updateUser({
          data: {
            face_verification_submitted: true,
            face_verification_image: uploadedPath,
            face_verification_status: 'pending'
          }
        });
      } catch (metadataErr) {
        console.error("Error updating metadata:", metadataErr);
        // Continue even if metadata update fails
      }

      // Insert verification record with the CORRECT column name
      try {
        const { error: insertError } = await supabase
          .from('face_verifications')
          .insert({
            user_id: userId,
            face_image_url: uploadedPath,  // Using the correct column name
            verification_status: 'pending'
          });
          
        if (insertError) {
          console.error("Insert error:", insertError);
          throw insertError;
        }
        
        console.log("Verification record created successfully");
        return true;
      } catch (insertErr) {
        console.error("Error creating verification record:", insertErr);
        throw insertErr;
      }
    } catch (err: any) {
      console.error('Verification submission error:', err);
      setError(err.message || 'Failed to submit verification. Please try again.');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  return { submitVerification, submitting, error };
}