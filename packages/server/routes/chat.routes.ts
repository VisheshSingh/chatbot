import express from 'express';
import { chatController } from '../controllers/chat.controller';

const router = express.Router();

router.post('/api/chats', chatController.sendMessage);

export default router;
