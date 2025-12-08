import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import z from 'zod';
import { conversationHistory } from './repositories/chat.repository';

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

      const client = new OpenAI({
         apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         input: prompt,
         temperature: 0.3,
         max_output_tokens: 500,
         previous_response_id:
            conversationHistory.getLastResponseId(conversation_id),
      });

      conversationHistory.setLastResponseId(conversation_id, response.id);

      res.json({ message: response.output_text });
   } catch (error) {
      res.status(500).json({
         message: 'Server could not process your request. Try again later!',
      });
   }
});

app.listen(PORT, () => console.log(`Server running on PORT: ${PORT}`));
