import { useEffect, useRef, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import TypingIndicator from './TypingIndicator';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

type Message = {
   content: string;
   role: 'user' | 'bot';
};

const ChatBot = () => {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isBotTyping, setIsBotTyping] = useState(false);
   const [error, setError] = useState('');

   const conversationId = useRef(crypto.randomUUID()).current;
   const lastMessageRef = useRef<HTMLDivElement | null>(null);

   const { register, reset, handleSubmit, formState } = useForm<FormData>();

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

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

   const onCopy = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   return (
      <div className='flex flex-col h-full'>
         <div className='flex flex-col flex-1 gap-2 mb-10 overflow-y-auto'>
            {messages.map((msg, index) => (
               <div
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                  key={index}
                  onCopy={onCopy}
                  className={`px-3 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
               >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
               </div>
            ))}
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
