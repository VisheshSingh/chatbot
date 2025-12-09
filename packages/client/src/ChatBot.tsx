import { use, useEffect, useRef, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from './components/ui/button';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

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

   const conversationId = useRef(crypto.randomUUID()).current;
   const formRef = useRef<HTMLFormElement | null>(null);

   const { register, reset, handleSubmit, formState } = useForm<FormData>();

   useEffect(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);
      reset();

      const { data } = await axios.post<ChatResponse>('/api/chats', {
         prompt,
         conversationId,
      });
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
      setIsBotTyping(false);
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div>
         <div className='flex flex-col gap-2 mb-10'>
            {messages.map((msg, index) => (
               <p
                  key={index}
                  className={`px-3 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
               >
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
               </p>
            ))}
            {isBotTyping && (
               <div className='flex gap-1 p-3 bg-gray-200 rounded-2xl self-start'>
                  <div className='w-2 h-2 rounded-full bg-gray-800 text-black animate-pulse'></div>
                  <div className='w-2 h-2 rounded-full bg-gray-800 text-black animate-pulse [animation-delay:0.2s]'></div>
                  <div className='w-2 h-2 rounded-full bg-gray-800 text-black animate-pulse [animation-delay:0.4s]'></div>
               </div>
            )}
         </div>
         <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className='flex flex-col gap-2 items-end border-2 p-4 rounded-3xl'
         >
            <textarea
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
