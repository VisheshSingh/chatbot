import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { chatController } from './controllers/chat.controller';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/api/health', (req: Request, res: Response) => {
   res.json({ message: '✅ health check success 🩺' });
});

app.post('/api/chats', chatController.sendMessage);

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
