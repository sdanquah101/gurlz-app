import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Dumbbell, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { supabase } from '../../lib/supabase';

export default function WorkoutBuddies() {
  const navigate = useNavigate();
  const [buddies, setBuddies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [isUserInList, setIsUserInList] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
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

  const formSteps = [
    { id: 1, title: 'Basic Info' },
    { id: 2, title: 'Workout Details' },
    { id: 3, title: 'Goals' },
    { id: 4, title: 'Contact Info' },
  ];

  const workoutGoals = [
    { value: 'weight-loss', label: 'Weight Loss' },
    { value: 'muscle-gain', label: 'Muscle Gain' },
    { value: 'endurance', label: 'Improve Endurance' },
    { value: 'flexibility', label: 'Increase Flexibility' },
    { value: 'general-fitness', label: 'General Fitness' },
  ];

  // Fetch user profile and check if user is in buddy list
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Fetch user profile
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, profile_image_url')
            .eq('id', user.id)
            .single();

          if (profileError) throw profileError;
          setUserProfile(profileData);

          // Check if user is in buddy list
          const { data: buddyData, error: buddyError } = await supabase
            .from('workout_buddies')
            .select()
            .eq('user_id', user.id)
            .single();

          if (buddyData) {
            setIsUserInList(true);
            setFormData(buddyData);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch all buddies
  useEffect(() => {

    const fetchBuddies = async () => {
      try {
        const { data, error } = await supabase
          .from('workout_buddies')
          .select(`
            *,
            user:profiles(username, profile_image_url)
          `);

        if (error) throw error;
        setBuddies(data);
      } catch (error) {
        console.error('Error fetching buddies:', error);
      }
    };

    fetchBuddies();
  }, [isUserInList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = async () => {
    if (currentStep < formSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      await handleAddBuddy();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddBuddy = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      // Save public buddy information
      const { error: publicError } = await supabase
        .from('workout_buddies')
        .upsert({
          user_id: user.id,
          location: formData.location,
          workout: formData.workout,
          workout_goal: formData.workoutGoal,
          goal_details: formData.goalDetails,
        });

      if (publicError) throw publicError;

      // Save private contact information
      const { error: privateError } = await supabase
        .from('workout_buddy_contacts')
        .upsert({
          user_id: user.id,
          phone: formData.phone,
          email: formData.email,
          facebook: formData.facebook,
          instagram: formData.instagram,
        });

      if (privateError) throw privateError;

      setIsUserInList(true);
      setShowPopup(false);
      setCurrentStep(1);
    } catch (error) {
      console.error('Error adding buddy:', error);
    }
  };

  const handleRemoveBuddy = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error: publicError } = await supabase
        .from('workout_buddies')
        .delete()
        .eq('user_id', user.id);

      if (publicError) throw publicError;

      const { error: privateError } = await supabase
        .from('workout_buddy_contacts')
        .delete()
        .eq('user_id', user.id);

      if (privateError) throw privateError;

      setIsUserInList(false);
    } catch (error) {
      console.error('Error removing buddy:', error);
    }
  };

  const filteredBuddies = buddies.filter(buddy =>
    buddy.user?.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.workout?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buddy.workout_goal?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            {/* User Profile Display */}
            <div className="flex items-center space-x-4 mb-6">
              {userProfile?.profile_image_url && (
                <img
                  src={userProfile.profile_image_url}
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <p className="font-medium">Username</p>
                <p className="text-gray-600">{userProfile?.username || 'Loading...'}</p>
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Your Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="E.g., Kasoa Iron City, East Legon, Ablekuma, etc."
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="workout" className="block text-sm font-medium text-gray-700">
                Preferred Workout Type
              </label>
              <input
                type="text"
                id="workout"
                name="workout"
                value={formData.workout}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="E.g., HIIT, CrossFit, Powerlifting, Yoga, Running"
                required
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label htmlFor="workoutGoal" className="block text-sm font-medium text-gray-700">
                Workout Goal
              </label>
              <select
                id="workoutGoal"
                name="workoutGoal"
                value={formData.workoutGoal}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              >
                {workoutGoals.map((goal) => (
                  <option key={goal.value} value={goal.value}>
                    {goal.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="goalDetails" className="block text-sm font-medium text-gray-700">
                Goal Details
              </label>
              <textarea
                id="goalDetails"
                name="goalDetails"
                value={formData.goalDetails}
                onChange={handleInputChange}
                className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="E.g., I want to lose 40 pounds, or I want to train for a marathon"
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h4 className="font-medium mb-4">Contact Information (Private)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="(555) 555-5555"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                  Facebook Profile URL
                </label>
                <input
                  type="url"
                  id="facebook"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="https://facebook.com/yourusername"
                />
              </div>

              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  id="instagram"
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleInputChange}
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  placeholder="@yourusername"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
              onClick={() => navigate('/my-buddies')}
            >
              My Buddies
            </Button>
          </div>
          <div className="mt-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Find Workout Buddies</h1>
            <p className="text-secondary-light/90">Connect with fitness enthusiasts near you</p>
            <div className="mt-4">
              {!isUserInList ? (
                <Button onClick={() => setShowPopup(true)} variant="secondary">
                  Add Yourself as a Buddy
                </Button>
              ) : (
                <Button onClick={handleRemoveBuddy} variant="secondary">
                  Remove Yourself from Buddy List
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

          {/* Buddy List */}
          <div className="space-y-4">
            {filteredBuddies.map((buddy) => (
              <div
                key={buddy.user_id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-secondary/5 rounded-xl hover:bg-secondary/10 transition-colors"
              >
                <img
                  src={buddy.user?.profile_image_url || "https://via.placeholder.com/100"}
                  alt={buddy.user?.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{buddy.user?.username}</h3>
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
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      Goal: {workoutGoals.find(g => g.value === buddy.workout_goal)?.label || buddy.workout_goal}
                    </span>
                    {buddy.goal_details && (
                      <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">
                        {buddy.goal_details}
                      </span>
                    )}
                  </div>
                </div>
                <Button className="w-full sm:w-auto">Connect</Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Form Modal */}
      {showPopup && (
        <Modal
          onClose={() => {
            setShowPopup(false);
            setCurrentStep(1);
          }}
          className="fixed inset-0 z-50 overflow-y-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="relative inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom bg-white rounded-lg shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6">
              {/* Close button */}
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPopup(false);
                    setCurrentStep(1);
                  }}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between w-full">
                  {formSteps.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-500'
                          }`}>
                          {step.id}
                        </div>
                        <span className="text-xs mt-1 text-gray-500">{step.title}</span>
                      </div>
                      {index < formSteps.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-2 ${currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
                          }`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Form Content */}
              <div className="min-h-[300px]">
                {renderStepContent()}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-4 border-t">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePrevStep}
                  className={`${currentStep === 1 ? 'invisible' : ''} flex items-center`}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex items-center"
                >
                  {currentStep === formSteps.length ? 'Submit' : 'Next'}
                  {currentStep !== formSteps.length && <ChevronRight className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}