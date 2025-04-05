import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Tabs from '@radix-ui/react-tabs';
import * as Toast from '@radix-ui/react-toast';
import { ArrowLeft } from 'lucide-react';
import BuddyCard from '../../components/physical/BuddyCard';
import { workoutBuddyService } from '../../services/workoutBuddyService';

const VIEWPORT_PADDING = 25;

const MyBuddiesPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userId = await workoutBuddyService.getCurrentUserId();
        setCurrentUserId(userId);

        const [requestsResponse, connectionsResponse] = await Promise.all([
          workoutBuddyService.getPendingRequests(),
          workoutBuddyService.getConnections(),
        ]);

        if (requestsResponse.error || connectionsResponse.error) {
          setToastMessage({
            title: 'Error',
            description: 'Failed to load data',
          });
          setToastOpen(true);
        } else {
          setRequests(requestsResponse.data || []);
          setConnections(connectionsResponse.data || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setToastMessage({
          title: 'Error',
          description: 'An error occurred while loading data',
        });
        setToastOpen(true);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const { error } = await workoutBuddyService.acceptRequest(requestId);
      if (error) {
        setToastMessage({ title: 'Error', description: 'Failed to accept request' });
      } else {
        const [requestsResponse, connectionsResponse] = await Promise.all([
          workoutBuddyService.getPendingRequests(),
          workoutBuddyService.getConnections(),
        ]);

        setRequests(requestsResponse.data || []);
        setConnections(connectionsResponse.data || []);
        setToastMessage({ title: 'Success', description: 'Connection request accepted!' });
      }
      setToastOpen(true);
    } catch (error) {
      console.error('Error accepting request:', error);
      setToastMessage({ title: 'Error', description: 'Failed to accept request' });
      setToastOpen(true);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const { error } = await workoutBuddyService.rejectRequest(requestId);
      if (error) {
        setToastMessage({ title: 'Error', description: 'Failed to reject request' });
      } else {
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        setToastMessage({ title: 'Success', description: 'Connection request rejected' });
      }
      setToastOpen(true);
    } catch (error) {
      console.error('Error rejecting request:', error);
      setToastMessage({ title: 'Error', description: 'Failed to reject request' });
      setToastOpen(true);
    }
  };

  const handleCancel = async (requestId) => {
    try {
      const { error } = await workoutBuddyService.cancelRequest(requestId);
      if (error) {
        setToastMessage({ title: 'Error', description: 'Failed to cancel request' });
      } else {
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        setToastMessage({ title: 'Success', description: 'Request cancelled successfully' });
      }
      setToastOpen(true);
    } catch (error) {
      console.error('Error cancelling request:', error);
      setToastMessage({ title: 'Error', description: 'Failed to cancel request' });
      setToastOpen(true);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  const incomingRequests = requests.filter(request => request.receiver_id === currentUserId);
  const outgoingRequests = requests.filter(request => request.requester_id === currentUserId);

  return (
    <Toast.Provider swipeDirection="right" duration={5000}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-4 sm:p-8 rounded-b-3xl">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <button
              onClick={() => navigate('/physical/workout-buddies')}
              className="flex items-center text-white hover:text-gray-300"
            >
              <ArrowLeft size={20} className="mr-2" />
              Back to Workout Buddies
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold">My Buddies</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
            <Tabs.List className="flex space-x-2 border-b mb-6">
              <Tabs.Trigger
                value="requests"
                className="relative px-4 py-2 hover:text-teal-600 data-[state=active]:text-teal-600 data-[state=active]:border-b-2 data-[state=active]:border-teal-600"
              >
                Requests
                {requests.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {requests.length}
                  </span>
                )}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="connections"
                className="px-4 py-2 hover:text-teal-600 data-[state=active]:text-teal-600 data-[state=active]:border-b-2 data-[state=active]:border-teal-600"
              >
                Connections
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="requests">
              {requests.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No pending requests</p>
              ) : (
                <div className="space-y-6">
                  {incomingRequests.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Incoming Requests</h3>
                      <div className="space-y-4">
                        {incomingRequests.map((request) => (
                          <BuddyCard
                            key={request.id}
                            buddy={request.requester}
                            currentUserId={currentUserId}
                            onAccept={() => handleAccept(request.id)}
                            onReject={() => handleReject(request.id)}
                            requestType="incoming"
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {outgoingRequests.length > 0 && (
                    <div>
                      <h3 className="text-lg font-medium mb-3">Sent Requests</h3>
                      <div className="space-y-4">
                        {outgoingRequests.map((request) => (
                          <BuddyCard
                            key={request.id}
                            buddy={request.receiver}
                            currentUserId={currentUserId}
                            onCancel={() => handleCancel(request.id)}
                            requestType="outgoing"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Tabs.Content>

            <Tabs.Content value="connections">
              {connections.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No connections yet</p>
              ) : (
                <div className="space-y-4">
                  {connections.map((connection) => {
                    const buddyInfo =
                      connection.requester_id === currentUserId
                        ? connection.receiver
                        : connection.requester;
                    return (
                      <BuddyCard
                        key={connection.id}
                        buddy={buddyInfo}
                        currentUserId={currentUserId}
                        requestType="connected"
                        showContactInfo={true}
                      />
                    );
                  })}
                </div>
              )}
            </Tabs.Content>
          </Tabs.Root>
        </div>

        <Toast.Root
          className="fixed bottom-4 right-4 w-auto max-w-md bg-white rounded-lg shadow-lg p-4 z-50 
                   data-[state=open]:animate-slideIn 
                   data-[state=closed]:animate-hide 
                   data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] 
                   data-[swipe=cancel]:translate-x-0 
                   data-[swipe=cancel]:transition-[transform_200ms_ease-out]
                   data-[swipe=end]:animate-swipeOut"
          open={toastOpen}
          onOpenChange={setToastOpen}
        >
          <Toast.Title className="text-sm font-medium text-gray-900">
            {toastMessage.title}
          </Toast.Title>
          <Toast.Description className="mt-1 text-sm text-gray-500">
            {toastMessage.description}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-[390px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
      </div>
    </Toast.Provider>
  );
};

export default MyBuddiesPage;