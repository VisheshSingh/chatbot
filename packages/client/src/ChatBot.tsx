import { useRef, useState } from 'react';
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
   const conversationId = useRef(crypto.randomUUID()).current;
   const { register, reset, handleSubmit, formState } = useForm<FormData>();

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      reset();

      const { data } = await axios.post<ChatResponse>('/api/chats', {
         prompt,
         conversationId,
      });
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
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
         </div>
         <form
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
