import express from 'express';
import { auth } from '../middleware/auth';
import { upload } from '../middleware/upload';
import { 
  createChatRoom, 
  getChatRooms, 
  getChatMessages, 
  sendMessage, 
  likeMessage, 
  replyToMessage,
  uploadMedia
} from '../controllers/chatController';

const router = express.Router();

router.post('/rooms', auth, createChatRoom);
router.get('/rooms', auth, getChatRooms);
router.get('/rooms/:roomId/messages', auth, getChatMessages);
router.post('/messages', auth, sendMessage);
router.post('/messages/:messageId/like', auth, likeMessage);
router.post('/messages/:messageId/reply', auth, replyToMessage);
router.post('/upload', auth, upload.single('media'), uploadMedia);

export default router;