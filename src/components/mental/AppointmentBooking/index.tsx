import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../common/Button';
import TherapistCard from './TherapistCard';
import { supabase } from '../../../lib/supabase'; // Supabase client

export default function AppointmentBooking() {
  const navigate = useNavigate();
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTherapists = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('therapists').select('*');
        if (error) throw error;

        setTherapists(data);
      } catch (err) {
        console.error('Error fetching therapists:', err);
        setError('Failed to load therapists. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTherapists();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-8 rounded-3xl">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigate('/mental')}
          className="mb-4"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Mental Wellness
        </Button>
        <h1 className="text-3xl font-bold mb-2">Book an Appointment</h1>
        <p className="text-secondary-light/90">Connect with mental health professionals</p>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-gray-500">Loading therapists...</p>
      )}

      {/* Error State */}
      {error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {/* Therapist List */}
      {!loading && !error && therapists.length === 0 && (
        <p className="text-center text-gray-500">No therapists available at the moment.</p>
      )}

      <div className="grid grid-cols-1 gap-6">
        {therapists.map((therapist) => (
          <TherapistCard
            key={therapist.id}
            {...therapist}
          />
        ))}
      </div>
    </div>
  );
}
