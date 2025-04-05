import React from 'react';
import { Loader2 } from 'lucide-react';

interface SignupFormFieldsProps {
  formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: string;
    country: string;
    phoneNumber: string;
    ageGroup: string;
  };
  onChange: (field: string, value: string) => void;
  disabled: boolean;
  errors?: Record<string, string>;
  isCheckingUsername?: boolean;
  isCheckingEmail?: boolean;
}

const SignupFormFields: React.FC<SignupFormFieldsProps> = ({
  formData,
  onChange,
  disabled,
  errors = {},
  isCheckingUsername = false,
  isCheckingEmail = false
}) => {
  // Database-compatible age group options
  const ageGroupOptions = [
    { value: '12-18', label: '12-18 years' },
    { value: '19-25', label: '19-25 years' },
    { value: '26-30', label: '26-30 years' },
    { value: '31-35', label: '31-35 years' },
    { value: '35+', label: '35+ years' }
  ];

  return (
    <>
      {/* Username field */}
      <div className="space-y-2">
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Username*
          {isCheckingUsername && (
            <Loader2 className="ml-2 inline-block h-4 w-4 animate-spin text-primary" />
          )}
        </label>
        <input
          type="text"
          id="username"
          className={`block w-full rounded-lg border ${
            errors.username ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
          value={formData.username}
          onChange={(e) => onChange('username', e.target.value)}
          disabled={disabled}
          required
          placeholder="Choose a unique username"
          minLength={3}
        />
        {errors.username && (
          <p className="text-sm text-red-600">{errors.username}</p>
        )}
        {!errors.username && formData.username.length >= 3 && !isCheckingUsername && (
          <p className="text-sm text-green-600">Username is available</p>
        )}
      </div>

      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email*
          {isCheckingEmail && (
            <Loader2 className="ml-2 inline-block h-4 w-4 animate-spin text-primary" />
          )}
        </label>
        <input
          type="email"
          id="email"
          className={`block w-full rounded-lg border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
          value={formData.email}
          onChange={(e) => onChange('email', e.target.value)}
          disabled={disabled}
          required
          placeholder="Enter your email address"
        />
        {errors.email && (
          <p className="text-sm text-red-600">{errors.email}</p>
        )}
        {!errors.email && formData.email.includes('@') && formData.email.includes('.') && !isCheckingEmail && (
          <p className="text-sm text-green-600">Email is valid</p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password*
        </label>
        <input
          type="password"
          id="password"
          className={`block w-full rounded-lg border ${
            errors.password ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
          value={formData.password}
          onChange={(e) => onChange('password', e.target.value)}
          disabled={disabled}
          required
          placeholder="Choose a secure password"
          minLength={6}
          autoComplete="new-password"
        />
        {errors.password && (
          <p className="text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password*
        </label>
        <input
          type="password"
          id="confirmPassword"
          className={`block w-full rounded-lg border ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
          value={formData.confirmPassword}
          onChange={(e) => onChange('confirmPassword', e.target.value)}
          disabled={disabled}
          required
          placeholder="Confirm your password"
          autoComplete="new-password"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Gender field */}
      <div className="space-y-2">
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
          Gender
        </label>
        <select
          id="gender"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={formData.gender}
          onChange={(e) => onChange('gender', e.target.value)}
          disabled={disabled}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>

      {/* Country field */}
      <div className="space-y-2">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Country
        </label>
        <input
          type="text"
          id="country"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={formData.country}
          onChange={(e) => onChange('country', e.target.value)}
          disabled={disabled}
          placeholder="Enter your country"
        />
      </div>

      {/* Phone Number field */}
      <div className="space-y-2">
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phoneNumber"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={formData.phoneNumber}
          onChange={(e) => onChange('phoneNumber', e.target.value)}
          disabled={disabled}
          placeholder="Enter your phone number"
        />
      </div>

      {/* Age Group field */}
      <div className="space-y-2">
        <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700">
          Age Group*
        </label>
        <select
          id="ageGroup"
          className={`block w-full rounded-lg border ${
            errors.ageGroup ? 'border-red-500' : 'border-gray-300'
          } px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50`}
          value={formData.ageGroup}
          onChange={(e) => onChange('ageGroup', e.target.value)}
          disabled={disabled}
          required
        >
          <option value="">Select age group</option>
          {ageGroupOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.ageGroup && (
          <p className="text-sm text-red-600">{errors.ageGroup}</p>
        )}
      </div>
    </>
  );
};

export default SignupFormFields;