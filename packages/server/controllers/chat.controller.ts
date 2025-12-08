import type { Request, Response } from 'express';
import z from 'zod';
import { chatService } from '../services/chat.service';

// IMPLEMENTATION DETAIL - validation schema
const chatSchema = z.object({
   prompt: z
      .string()
      .trim()
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt cannot exceed 1000 chars'),
   conversation_id: z.uuid(),
});

// PUBLIC INTERFACE
export const chatController = {
   async sendMessage(req: Request, res: Response) {
      const parsedRequest = chatSchema.safeParse(req.body);

      if (!parsedRequest.success) {
         res.status(400).json(parsedRequest.error.format);
         return;
      }

      try {
         const { prompt, conversation_id } = req.body;

         const response = await chatService.sendMessage(
            prompt,
            conversation_id
         );

         res.json({ message: response.message });
      } catch (error) {
         res.status(500).json({
            message: 'Server could not process your request. Try again later!',
         });
      }
   },
};
