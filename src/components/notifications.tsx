import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Notification {
  id: string;
  therapist_name: string;
  date: string;
  time: string;
  status: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch notifications
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            id,
            status,
            date,
            time,
            therapists!appointments_therapist_id_fkey (
              name
            )
          `);

        if (error) throw error;

        // Map data to a usable format
        const mappedData = data.map((appointment: any) => ({
          id: appointment.id,
          therapist_name: appointment.therapists.name,
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
        }));

        setNotifications(mappedData);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Real-time subscription
    const channel = supabase
      .channel('appointments-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setNotifications((prev) =>
              prev.map((notif) =>
                notif.id === payload.new.id
                  ? { ...notif, status: payload.new.status }
                  : notif
              )
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading notifications...</p>;
  }

  if (notifications.length === 0) {
    return <p className="text-center text-gray-500">No notifications available.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Notifications</h3>
      <div className="space-y-2">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`p-4 rounded-lg border ${
              notif.status === 'pending'
                ? 'border-yellow-500 bg-yellow-50'
                : 'border-green-500 bg-green-50'
            }`}
          >
            <p className="font-medium">{notif.therapist_name}</p>
            <p className="text-sm text-gray-500">
              {notif.date} at {notif.time}
            </p>
            <p
              className={`text-sm font-semibold ${
                notif.status === 'pending'
                  ? 'text-yellow-600'
                  : 'text-green-600'
              }`}
            >
              {notif.status === 'pending' ? 'Pending Confirmation' : 'Confirmed'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
