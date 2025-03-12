import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Dumbbell } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { supabase } from '../../lib/supabase';

export default function WorkoutBuddies() {
  const navigate = useNavigate();
  const location = useLocation();
  const [buddies, setBuddies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [connections, setConnections] = useState({});  // Store connection status for each buddy
  const [formData, setFormData] = useState({
    location: '',
    workout: '',
    workoutGoal: 'weight-loss',
    goalDetails: '',
    phone: '',
    email: '',
    facebook: '',
    instagram: '',
  });

  // Fetch user profile and buddy data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        if (user) {
          const [profileResult, buddyResult] = await Promise.all([
            supabase
              .from('profiles')
              .select('id, username, profile_image_url')
              .eq('id', user.id)
              .single(),
            supabase
              .from('workout_buddies')
              .select()
              .eq('user_id', user.id)
              .single()
          ]);

          if (profileResult.error) throw profileResult.error;
          setUserProfile(profileResult.data);

          if (buddyResult.data) {
            setFormData(buddyResult.data);
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch all buddies and their connection status
  useEffect(() => {
    const fetchBuddies = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch buddies
        const { data: buddiesData, error: buddiesError } = await supabase
          .from('workout_buddies')
          .select('*');

        if (buddiesError) throw buddiesError;

        // Fetch all connections for current user
        const { data: connectionsData, error: connectionsError } = await supabase
          .from('workout_buddy_connections')
          .select('*')
          .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

        if (connectionsError) throw connectionsError;

        // Create a map of connections
        const connectionMap = {};
        connectionsData.forEach(conn => {
          if (conn.requester_id === user.id) {
            connectionMap[conn.receiver_id] = conn;
          } else {
            connectionMap[conn.requester_id] = conn;
          }
        });

        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, profile_image_url')
          .in('id', buddiesData.map(buddy => buddy.user_id));

        if (profilesError) throw profilesError;

        const combinedData = buddiesData.map(buddy => ({
          ...buddy,
          profile: profilesData.find(profile => profile.id === buddy.user_id),
        }));

        setBuddies(combinedData);
        setConnections(connectionMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBuddies();
  }, []);

  const handleConnect = async (buddyId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to connect with buddies');
      }

      const existingConnection = connections[buddyId];

      if (existingConnection?.status === 'accepted') {
        // Handle disconnect
        const { error: deleteError } = await supabase
          .from('workout_buddy_connections')
          .delete()
          .match({
            requester_id: existingConnection.requester_id,
            receiver_id: existingConnection.receiver_id
          });

        if (deleteError) throw deleteError;

        setConnections(prev => {
          const newConnections = { ...prev };
          delete newConnections[buddyId];
          return newConnections;
        });
        return;
      }

      // Handle new connection
      const { error: insertError } = await supabase
        .from('workout_buddy_connections')
        .insert({
          requester_id: user.id,
          receiver_id: buddyId,
          status: 'pending',
        });

      if (insertError) throw insertError;

      setConnections(prev => ({
        ...prev,
        [buddyId]: {
          requester_id: user.id,
          receiver_id: buddyId,
          status: 'pending'
        }
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredBuddies = buddies.filter(buddy =>
    buddy.profile?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.workout?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.workout_goal?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isMainPage = location.pathname === '/physical/workout-buddies';

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-red-600 font-medium mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 sm:p-8 rounded-b-3xl">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/physical')}
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Physical
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/physical/my-buddies')}
            >
              My Buddies
            </Button>
          </div>
          <div className="mt-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Find Workout Buddies</h1>
            <p className="text-secondary-light/90">Connect with fitness enthusiasts near you</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isMainPage && (
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, workout type, location, or goal..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-primary/20 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              /* Buddy List */
              <div className="space-y-4">
                {filteredBuddies.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No workout buddies found matching your search.
                  </div>
                ) : (
                  filteredBuddies.map((buddy) => (
                    <div
                      key={buddy.user_id}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-secondary/5 rounded-xl hover:bg-secondary/10 transition-colors"
                    >
                      <img
                        src={buddy.profile?.profile_image_url || "https://via.placeholder.com/100"}
                        alt={buddy.profile?.username}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{buddy.profile?.username}</h3>
                        <div className="flex flex-wrap items-center text-sm text-gray-500 mt-1 gap-2">
                          <div className="flex items-center">
                            <MapPin size={16} className="mr-1" />
                            {buddy.location}
                          </div>
                          <div className="flex items-center">
                            <Dumbbell size={16} className="mr-1" />
                            {buddy.workout}
                          </div>
                        </div>
                      </div>
                      {buddy.user_id !== userProfile?.id && (
                        <Button
                          onClick={() => handleConnect(buddy.user_id)}
                          className="w-full sm:w-auto"
                        >
                          {!connections[buddy.user_id] && "Connect"}
                          {connections[buddy.user_id]?.status === 'pending' && "Request Sent"}
                          {connections[buddy.user_id]?.status === 'accepted' && "Disconnect"}
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        {!isMainPage && <Outlet />}
      </div>
    </div>
  );
}