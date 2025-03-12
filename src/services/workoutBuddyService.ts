import { supabase } from '../lib/supabase';

export const workoutBuddyService = {
    getCurrentUserId: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        return user?.id;
    },

    async getPendingRequests() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { error: 'No user logged in' };

            const { data, error } = await supabase
                .from('workout_buddy_connections')
                .select(`
                    id,
                    status,
                    requester_id,
                    receiver_id,
                    requester:profiles!fk_requester_id(
                        id,
                        username,
                        profile_image_url
                    ),
                    receiver:profiles!fk_receiver_id(
                        id,
                        username,
                        profile_image_url
                    ),
                    requester_buddy:workout_buddies!fk_requester_workout(
                        location,
                        workout,
                        workout_goal
                    ),
                    receiver_buddy:workout_buddies!fk_receiver_workout(
                        location,
                        workout,
                        workout_goal
                    )
                `)
                .eq('status', 'pending')
                .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

            if (error) {
                console.error('Supabase error:', error);
                return { error };
            }

            // Combine profile and workout_buddies data
            const transformedData = data?.map(item => ({
                ...item,
                requester: {
                    ...item.requester,
                    ...item.requester_buddy
                },
                receiver: {
                    ...item.receiver,
                    ...item.receiver_buddy
                }
            }));

            console.log('Transformed pending requests:', transformedData);
            return { data: transformedData, error: null };
        } catch (error) {
            console.error('Error in getPendingRequests:', error);
            return { error };
        }
    },

    async getConnections() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return { error: 'No user logged in' };

            const { data, error } = await supabase
                .from('workout_buddy_connections')
                .select(`
                    id,
                    status,
                    requester_id,
                    receiver_id,
                    requester:profiles!fk_requester_id(
                        id,
                        username,
                        profile_image_url
                    ),
                    receiver:profiles!fk_receiver_id(
                        id,
                        username,
                        profile_image_url
                    ),
                    requester_buddy:workout_buddies!fk_requester_workout(
                        location,
                        workout,
                        workout_goal,
                        goalDetails,
                        email,
                        phone,
                        facebook,
                        instagram
                    ),
                    receiver_buddy:workout_buddies!fk_receiver_workout(
                        location,
                        workout,
                        workout_goal,
                        goalDetails,
                        email,
                        phone,
                        facebook,
                        instagram
                    )
                `)
                .eq('status', 'accepted')
                .or(`requester_id.eq.${user.id},receiver_id.eq.${user.id}`);

            if (error) {
                console.error('Supabase connections error:', error);
                return { error };
            }

            // Combine profile and workout_buddies data
            const transformedData = data?.map(item => ({
                ...item,
                requester: {
                    ...item.requester,
                    ...item.requester_buddy
                },
                receiver: {
                    ...item.receiver,
                    ...item.receiver_buddy
                }
            }));

            console.log('Transformed connections:', transformedData);
            return { data: transformedData, error: null };
        } catch (error) {
            console.error('Error in getConnections:', error);
            return { error };
        }
    },

    async sendConnectionRequest(receiverId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: 'No user logged in' };

        // Check if a connection already exists
        const { data: existing } = await supabase
            .from('workout_buddy_connections')
            .select()
            .or(`and(requester_id.eq.${user.id},receiver_id.eq.${receiverId}),and(requester_id.eq.${receiverId},receiver_id.eq.${user.id})`)
            .single();

        if (existing) {
            return { error: 'Connection already exists' };
        }

        const { data, error } = await supabase
            .from('workout_buddy_connections')
            .insert([
                {
                    requester_id: user.id,
                    receiver_id: receiverId,
                    status: 'pending'
                }
            ])
            .select()
            .single();

        return { data, error };
    },

    async acceptRequest(connectionId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: 'No user logged in' };

        const { data, error } = await supabase
            .from('workout_buddy_connections')
            .update({ status: 'accepted' })
            .eq('id', connectionId)
            .eq('receiver_id', user.id)
            .select()
            .single();

        return { data, error };
    },

    async rejectRequest(connectionId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: 'No user logged in' };

        const { data, error } = await supabase
            .from('workout_buddy_connections')
            .delete()
            .eq('id', connectionId)
            .eq('receiver_id', user.id)
            .select()
            .single();

        return { data, error };
    },

    async cancelRequest(connectionId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { error: 'No user logged in' };

        const { data, error } = await supabase
            .from('workout_buddy_connections')
            .delete()
            .eq('id', connectionId)
            .eq('requester_id', user.id)
            .select()
            .single();

        return { data, error };
    }
};