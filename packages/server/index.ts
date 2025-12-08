import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import z from 'zod';
import { chatService } from './services/chat.service';

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get('/api/health', (req: Request, res: Response) => {
   res.json({ message: '✅ health check success 🩺' });
});

const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt cannot exceed 1000 chars'),
   conversation_id: z.uuid(),
});

app.post('/api/chats', async (req: Request, res: Response) => {
   const parsedRequest = chatSchema.safeParse(req.body);

   if (!parsedRequest.success) {
      res.status(400).json(parsedRequest.error.format);
      return;
   }

   try {
      const { prompt, conversation_id } = req.body;

      const response = await chatService.sendMessage(prompt, conversation_id);

      res.json({ message: response.message });
   } catch (error) {
      res.status(500).json({
         message: 'Server could not process your request. Try again later!',
      });
   }
});

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
