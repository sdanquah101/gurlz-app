import { supabase } from './supabase';

// Default chat rooms
const DEFAULT_ROOMS = [
  {
    name: 'Mental Health',
    description: 'Share experiences and support for mental well-being',
    category: 'mental'
  },
  {
    name: 'Physical Health',
    description: 'Discuss fitness, nutrition, and general health',
    category: 'physical'
  },
  {
    name: 'Sexual Health',
    description: 'Safe space for reproductive health discussions',
    category: 'sexual'
  }
];

export const chatService = {
  async initializeDefaultRooms() {
    const { data: existingRooms } = await supabase
      .from('chat_rooms')
      .select('category');

    const existingCategories = new Set(existingRooms?.map(r => r.category));
    
    for (const room of DEFAULT_ROOMS) {
      if (!existingCategories.has(room.category)) {
        await supabase
          .from('chat_rooms')
          .insert(room)
          .select()
          .single();
      }
    }
  },

  async getRoomByCategory(category: string) {
    const { data, error } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('category', category)
      .single();

    if (error) throw error;
    return data;
  },

  async getMessages(roomId: string) {
    const { data, error } = await supabase
      .from('chat_messages')
      .select(`
        *,
        author:profiles!user_id(id, username),
        likes:message_likes(user_id),
        comments:message_comments(
          id,
          content,
          is_anonymous,
          created_at,
          author:profiles!user_id(id, username)
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async sendMessage(roomId: string, userId: string, content: string, isAnonymous: boolean = false) {
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        room_id: roomId,
        user_id: userId,
        content,
        is_anonymous: isAnonymous
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async likeMessage(messageId: string, userId: string) {
    const { error } = await supabase
      .from('message_likes')
      .insert({
        message_id: messageId,
        user_id: userId
      });

    if (error) throw error;
  },

  async unlikeMessage(messageId: string, userId: string) {
    const { error } = await supabase
      .from('message_likes')
      .delete()
      .match({
        message_id: messageId,
        user_id: userId
      });

    if (error) throw error;
  },

  async addComment(messageId: string, userId: string, content: string, isAnonymous: boolean = false) {
    const { data, error } = await supabase
      .from('message_comments')
      .insert({
        message_id: messageId,
        user_id: userId,
        content,
        is_anonymous: isAnonymous
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};