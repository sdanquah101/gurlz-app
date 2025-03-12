import React from 'react';
import { MapPin, Dumbbell } from 'lucide-react';

// Reusable Button Component
const Button = ({ children, className = '', ...props }) => (
    <button
        {...props}
        className={`px-4 py-2 rounded-md text-white hover:opacity-90 ${className}`}
    >
        {children}
    </button>
);

const BuddyCard = ({
    buddy,
    currentUserId,
    onAccept,
    onReject,
    onCancel,
    requestType = 'incoming',  // 'incoming', 'outgoing', or 'connected'
    showContactInfo = false,
}) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex items-center justify-between gap-4">
                {/* Left side - Avatar and Info */}
                <div className="flex items-center gap-4">
                    <img
                        src={buddy?.profile_image_url || "https://via.placeholder.com/100"}
                        alt={buddy?.username}
                        className="w-12 h-12 rounded-full object-cover"
                    />

                    <div>
                        <h2 className="font-bold text-teal-900">{buddy?.username}</h2>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            {buddy?.location && (
                                <span className="flex items-center">
                                    <MapPin size={16} className="mr-1" />
                                    {buddy.location}
                                </span>
                            )}
                            {buddy?.workout && (
                                <span className="flex items-center">
                                    <Dumbbell size={16} className="mr-1" />
                                    {buddy.workout}
                                </span>
                            )}
                        </div>

                        {showContactInfo && (
                            <div className="mt-2 text-sm text-gray-600">
                                {buddy?.email && <div>Email: {buddy.email}</div>}
                                {buddy?.phone && <div>Phone: {buddy.phone}</div>}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right side - Actions */}
                <div className="flex gap-2">
                    {requestType === 'incoming' && (
                        <>
                            <Button
                                onClick={onAccept}
                                className="bg-teal-600 hover:bg-teal-700"
                            >
                                Accept
                            </Button>
                            <Button
                                onClick={onReject}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Reject
                            </Button>
                        </>
                    )}
                    {requestType === 'outgoing' && (
                        <Button
                            onClick={onCancel}
                            className="bg-gray-600 hover:bg-gray-700"
                        >
                            Cancel Request
                        </Button>
                    )}
                    {requestType === 'connected' && (
                        <span className="px-4 py-2 text-teal-600 font-medium">
                            Connected
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BuddyCard;