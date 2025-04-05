import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import IndividualSignup from './SignupForm/IndividualSignup';
import OrganizationSignup from './SignupForm/OrganizationSignup';
import VendorSignup from './SignupForm/VendorSignup';

type UserType = 'individual' | 'organization' | 'vendor';

export default function SignupForm() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('individual'); // Default to individual
  
  const renderUserTypeSelection = () => {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center mb-6">Select Account Type</h2>
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => setUserType('individual')}
            className={`p-4 rounded-xl border-2 ${
              userType === 'individual' ? 'border-primary bg-primary/10' : 'border-gray-200'
            } transition-colors`}
          >
            <div className="font-medium">Individual</div>
            <p className="text-sm text-gray-500">For personal use</p>
          </button>
          
          <button
            onClick={() => setUserType('organization')}
            className={`p-4 rounded-xl border-2 ${
              userType === 'organization' ? 'border-primary bg-primary/10' : 'border-gray-200'
            } transition-colors`}
          >
            <div className="font-medium">Organization</div>
            <p className="text-sm text-gray-500">For companies, schools and groups</p>
          </button>
          
          <button
            onClick={() => setUserType('vendor')}
            className={`p-4 rounded-xl border-2 ${
              userType === 'vendor' ? 'border-primary bg-primary/10' : 'border-gray-200'
            } transition-colors`}
          >
            <div className="font-medium">Vendor</div>
            <p className="text-sm text-gray-500">For businesses providing services</p>
          </button>
        </div>
      </div>
    );
  };

  const renderSignupForm = () => {
    switch (userType) {
      case 'individual':
        return <IndividualSignup />;
      case 'organization':
        return <OrganizationSignup />;
      case 'vendor':
        return <VendorSignup />;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <Heart className="inline-block text-primary-dark w-12 h-12 mb-2" />
          <h1 className="text-4xl font-bold text-primary-dark mb-2">Gurlz</h1>
          <p className="text-primary text-lg">Join our community</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 animate-slide-in">
          {/* If you want to show the user type selection, uncomment this */}
          {/* {renderUserTypeSelection()} */}
          
          {/* Directly show the individual signup form */}
          {renderSignupForm()}

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