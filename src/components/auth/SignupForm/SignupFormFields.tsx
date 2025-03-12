import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle2, Mail, Lock, Globe, Phone, Calendar } from 'lucide-react';
import { FormField } from './components/FormField';
import { GenderSelector } from './components/GenderSelector';

type AgeGroup = '' | '12-18' | '19-25' | '26-30' | '21-35' | '35+';

interface SignupFormFieldsProps {
  formData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    gender: string;
    country: string;
    phoneNumber: string;
    ageGroup: AgeGroup;
  };
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export default function SignupFormFields({ formData, onChange, disabled }: SignupFormFieldsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <FormField
        icon={UserCircle2}
        type="text"
        value={formData.username}
        onChange={(e) => onChange('username', e.target.value)}
        placeholder="Username"
        required
        minLength={3}
        disabled={disabled}
      />

      <FormField
        icon={Mail}
        type="email"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        placeholder="Email"
        required
        disabled={disabled}
      />

      <FormField
        icon={Lock}
        type="password"
        value={formData.password}
        onChange={(e) => onChange('password', e.target.value)}
        placeholder="Password (min. 6 characters)"
        required
        minLength={6}
        disabled={disabled}
      />

      <FormField
        icon={Lock}
        type="password"
        value={formData.confirmPassword}
        onChange={(e) => onChange('confirmPassword', e.target.value)}
        placeholder="Confirm Password"
        required
        minLength={6}
        disabled={disabled}
      />

      <div className="relative">
        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50" size={20} />
        <select
          value={formData.country}
          onChange={(e) => onChange('country', e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
          required
          disabled={disabled}
        >
          <option value="">Select Country</option>
          <option value="GH">Ghana</option>
          <option value="NG">Nigeria</option>
          <option value="KE">Kenya</option>
          <option value="ZA">South Africa</option>
        </select>
      </div>

      <FormField
        icon={Phone}
        type="tel"
        value={formData.phoneNumber}
        onChange={(e) => onChange('phoneNumber', e.target.value)}
        placeholder="Phone Number"
        pattern="[+]?[\d\s-]+"
        title="Please enter a valid phone number"
        required
        disabled={disabled}
      />

      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50" size={20} />
        <select
          value={formData.ageGroup}
          onChange={(e) => onChange('ageGroup', e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
          required
          disabled={disabled}
        >
          <option value="">Select Age Group</option>
          <option value="12-18">12-18</option>
          <option value="19-25">19-25</option>
          <option value="26-30">26-30</option>
          <option value="31-35">31-35</option>
          <option value="35+">35+</option>
        </select>
      </div>

      <GenderSelector
        value={formData.gender}
        onChange={(value) => onChange('gender', value)}
        disabled={disabled}
      />
    </motion.div>
  );
}