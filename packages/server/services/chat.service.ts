import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';
import { conversationHistory } from '../repositories/chat.repository';
import template from '../prompts/chatbot.txt';

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

type chatResponse = {
   id: string;
   message: string;
};

const parkInfo = fs.readFileSync(
   path.join(__dirname, '../prompts/WonderWorld.md'),
   'utf-8'
);
const instructions = template.replace('{{placeInfo}}', parkInfo);

export const chatService = {
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<chatResponse> {
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         instructions,
         input: prompt,
         temperature: 0.3,
         max_output_tokens: 500,
         previous_response_id:
            conversationHistory.getLastResponseId(conversationId),
      });

      conversationHistory.setLastResponseId(conversationId, response.id);

      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
