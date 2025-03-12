import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, Building2, Mail, Phone, Globe, Lock } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import Button from '../../common/Button';

export default function VendorSignup() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    registrationNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    country: '',
    address: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    setLoading(true);

    const { success, error } = await signUp({
      email: formData.email,
      password: formData.password,
      username: formData.businessName,
      gender: 'female', // Default for vendors
      country: formData.country,
      phoneNumber: formData.phone,
      userType: 'vendor'
    });

    if (success) {
      navigate('/dashboard');
    } else {
      setError(error || 'Failed to sign up');
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="relative">
          <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50" size={20} />
          <input
            type="text"
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Business Name"
            required
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50" size={20} />
          <input
            type="text"
            value={formData.businessType}
            onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Business Type"
            required
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50" size={20} />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Business Email"
            required
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50" size={20} />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Password"
            required
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50" size={20} />
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Confirm Password"
            required
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50" size={20} />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="Phone Number"
            required
            disabled={loading}
          />
        </div>

        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary/50" size={20} />
          <select
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
            disabled={loading}
          >
            <option value="">Select Country</option>
            <option value="GH">Ghana</option>
            <option value="NG">Nigeria</option>
            <option value="KE">Kenya</option>
            <option value="ZA">South Africa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Business Address
          </label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full p-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
            rows={3}
            required
            disabled={loading}
          />
        </div>
      </motion.div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Creating Account...' : 'Create Vendor Account'}
      </Button>
    </form>
  );
}