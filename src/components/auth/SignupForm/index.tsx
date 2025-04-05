import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import UserTypeSelection from './UserTypeSelection';
import IndividualSignup from './IndividualSignup';
import OrganizationSignup from './OrganizationSignup';
import VendorSignup from './VendorSignup';
import SignupProgress from './SignupProgress';
import { UserType } from '../../../types/auth';

export default function SignupForm() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType | null>(null);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <Heart className="inline-block text-primary-dark w-12 h-12 mb-2" />
          <h1 className="text-4xl font-bold text-primary-dark mb-2">Gurlz</h1>
          <p className="text-primary text-lg">Join our community</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-in">
          {!userType ? (
            <UserTypeSelection onSelect={setUserType} />
          ) : (
            <>
              <SignupProgress userType={userType} />
              {userType === 'individual' && <IndividualSignup />}
              {userType === 'organization' && <OrganizationSignup />}
              {userType === 'vendor' && <VendorSignup />}
            </>
          )}

          <p className="mt-6 text-center text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary hover:text-primary-light font-medium transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}