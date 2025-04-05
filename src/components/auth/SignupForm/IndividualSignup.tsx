import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../common/Button';
import SignupFormFields from '../SignupForm/SignupFormFields';
import { FaceVerificationStep } from '../SignupForm/components/FaceVerificationStep';

type AgeGroup = '' | '12-18' | '19-25' | '26-30' | '31-35' | '35+';

export default function IndividualSignup() {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    country: '',
    phoneNumber: '',
    ageGroup: '' as AgeGroup
  });

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear field-specific error when user changes that field
    if (fieldErrors[field]) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Validate age group against allowed values from DB constraint
    const validAgeGroups = ['12-18', '19-25', '26-30', '31-35', '35+'];
    if (!formData.ageGroup) {
      newErrors.ageGroup = 'Age group is required';
    } else if (!validAgeGroups.includes(formData.ageGroup)) {
      newErrors.ageGroup = 'Please select a valid age group';
      console.error(`Invalid age group: "${formData.ageGroup}". Valid options are: ${validAgeGroups.join(', ')}`);
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate form before submission
    if (!validateForm()) {
      setError('Please correct the errors before continuing');
      return;
    }

    try {
      const { success, error, data } = await signUp({
        email: formData.email,
        password: formData.password,
        username: formData.username,
        gender: formData.gender as 'female' | 'male',
        country: formData.country,
        phoneNumber: formData.phoneNumber,
        ageGroup: formData.ageGroup,
        type: 'individual'
      });

      if (success && data?.id) {
        setUserId(data.id);
        setStep(2);
      } else {
        throw new Error(error || 'Failed to sign up');
      }
    } catch (err: any) {
      console.error('Signup error:', err);
      setError(err.message);

      // Handle specific errors from backend
      if (err.message.includes('age group')) {
        setFieldErrors(prev => ({ ...prev, ageGroup: 'Valid age group is required' }));
      }
    }
  };

  const handleVerificationComplete = (success: boolean) => {
    console.log("Verification complete callback with success:", success);
    if (success) {
      // Move to email confirmation step
      setStep(3);
    } else {
      setError('');
      // Don't go back to step 1, just stay on verification step to retry
    }
  };

  const renderFieldError = (field: keyof typeof formData) => {
    return fieldErrors[field] ? (
      <div className="text-sm text-red-600 mt-1">{fieldErrors[field]}</div>
    ) : null;
  };

  return (
    <div className="max-w-md mx-auto">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm mb-6">
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="signup-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <SignupFormFields
                formData={formData}
                onChange={handleFieldChange}
                disabled={loading}
                errors={fieldErrors}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Continue to Face Verification'}
              </Button>
            </form>
          </motion.div>
        ) : step === 2 ? (
          <motion.div
            key="face-verification"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {userId && (
              <FaceVerificationStep
                userId={userId}
                onComplete={handleVerificationComplete}
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="email-confirmation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center"
          >
            <h2 className="text-2xl font-semibold mb-4">Account Setup Complete!</h2>
            <p className="mb-6">
              We've sent a confirmation email to <span className="font-medium">{formData.email}</span>.
              Please check your inbox and click the link to verify your email address.
            </p>

            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 mb-6">
              <h3 className="font-medium text-amber-800 mb-2">Important:</h3>
              <p className="text-amber-700 text-sm">
                Your account won't be activated until you verify your email.
                The verification link is only valid for 24 hours.
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg mb-6">
              <h3 className="font-medium text-blue-800 mb-2">Next steps:</h3>
              <ul className="text-sm text-blue-700 text-left">
                <li className="mb-1">• Your face verification has been submitted for review</li>
                <li className="mb-1">• Please verify your email by clicking the link we sent</li>
                <li className="mb-1">• Log in after email verification</li>
                <li>• Your profile will be automatically created on first login</li>
              </ul>
            </div>
            <div className="space-y-4">
              <Button
                onClick={() => navigate('/login')}
                className="w-full"
              >
                Go to Login
              </Button>
              <p className="text-sm text-gray-500">
                You can login after verifying your email. Don't forget to check your spam folder.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}