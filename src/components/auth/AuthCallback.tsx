import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleEmailVerification = async () => {
      try {
        // Get the auth token from the URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        if (!accessToken || !refreshToken) {
          throw new Error('No authentication tokens found in URL');
        }

        if (type === 'recovery') {
          // Handle password reset flow
          navigate('/reset-password', { 
            state: { 
              access_token: accessToken,
              refresh_token: refreshToken
            } 
          });
          return;
        }

        // Set the auth session
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (error) throw error;

        // Email verification successful, redirect to login
        setLoading(false);
        navigate('/login', { 
          state: { 
            emailVerified: true,
            message: 'Email verified successfully! You can now log in.' 
          } 
        });
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    handleEmailVerification();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-secondary-dark p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Verifying your email...</h1>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
            <p className="mt-4 text-gray-600">Please wait while we verify your email address.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary to-secondary-dark p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Verification Failed</h1>
            <p className="mb-6 text-gray-700">{error}</p>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;