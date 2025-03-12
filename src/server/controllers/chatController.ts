#import { Request, Response } from 'express';
import { ChatMessage } from '../models/ChatMessage';
import { User } from '../models/User';
import { upload } from '../middleware/upload';

// Create Chat Room
export const createChatRoom = async (req: Request, res: Response) => {
  try {
    const { name, description, category } = req.body;

    // Ensure the user exists and has a valid UUID
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Create chat room as a chat message or relevant model logic
    const message = new ChatMessage({
      userId: user.id,
      content: description,
      topic: category,
      timestamp: new Date(),
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ message: 'Error creating chat room' });
  }
};

// Upload Media
export const uploadMedia = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Use multer or similar middleware to handle file uploads
    const mediaUrl = `/uploads/${req.file.filename}`;
    res.json({ url: mediaUrl });
  } catch (error) {
    console.error('Error uploading media:', error);
    res.status(500).json({ message: 'Error uploading media' });
  }
};

// Send Message
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { content, topic, anonymous, mediaUrl } = req.body;

    // Ensure the user exists and has a valid UUID
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Create the message
    const message = new ChatMessage({
      userId: user.id,
      content,
      topic,
      anonymous,
      mediaUrl: mediaUrl || null,
      timestamp: new Date(),
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// Get All Messages
export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const messages = await ChatMessage.find().sort({ timestamp: -1 }).populate('userId', 'username');
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

// Delete Message
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;

    // Check if the message exists
    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Ensure the user is the author or has admin privileges
    if (message.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this message' });
    }

    await message.remove();
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: 'Error deleting message' });
  }
};

// Update Message
export const updateMessage = async (req: Request, res: Response) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    // Check if the message exists
    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Ensure the user is the author
    if (message.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized to update this message' });
    }

    // Update the content
    message.content = content;
    message.updated_at = new Date();
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ message: 'Error updating message' });
  }
};
