import { useRef, useState } from 'react';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import TypingIndicator from './TypingIndicator';
import ChatMessages, { type Message } from './ChatMessages';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState('');

   const conversationId = useRef(crypto.randomUUID()).current;

   const { register, reset, handleSubmit, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      try {
         setError('');
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
         setIsBotTyping(true);
         reset({ prompt: '' });

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

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div className='flex flex-col h-full'>
         <div className='flex flex-col flex-1 gap-2 mb-10 overflow-y-auto'>
            <ChatMessages messages={messages} />
            {isBotTyping && <TypingIndicator />}
            {error && (
               <div className='p-3 bg-red-200 text-red-800 rounded-2xl self-start'>
                  {error}
               </div>
            )}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className='flex flex-col gap-2 items-end border-2 p-4 rounded-3xl'
         >
            <textarea
               autoFocus
               {...register('prompt', {
                  required: true,
                  validate: (value) => value.trim().length > 0,
               })}
               placeholder='Ask anything...'
               className='w-full p-2 border-0 focus:outline-0 resize-none'
            />
            <Button
               disabled={!formState.isValid}
               className='w-9 h-9 rounded-3xl'
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
