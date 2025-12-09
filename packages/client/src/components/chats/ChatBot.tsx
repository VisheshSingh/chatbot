import { useRef, useState } from 'react';
import axios from 'axios';
import TypingIndicator from './TypingIndicator';
import ChatMessages, { type Message } from './ChatMessages';
import ChatInput, { type ChatFormData } from './ChatInput';

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState('');

   const conversationId = useRef(crypto.randomUUID()).current;

   const onSubmit = async ({ prompt }: ChatFormData) => {
      try {
         setError('');
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);

         const { data } = await axios.post<ChatResponse>('/api/chats', {
            prompt,
            conversationId,
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'bot' },
         ]);
      } catch (error) {
         setError('Something went wrong. Please try again.');
      } finally {
         setIsBotTyping(false);
      }
   };

   return (
      <div className='flex flex-col h-full w-lg mx-auto'>
         <div className='flex flex-col flex-1 gap-2 mb-10 overflow-y-auto'>
            <ChatMessages messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && (
               <div className='p-3 bg-red-200 text-red-800 rounded-2xl self-start'>
                  {error}
               </div>
            )}
         </div>
         <ChatInput onSubmit={onSubmit} />
      </div>
   );
};

export default ChatBot;
