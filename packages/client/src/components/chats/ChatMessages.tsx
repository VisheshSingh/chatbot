import { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export type Message = {
   content: string;
   role: 'user' | 'bot';
};

type chatMessagesProps = {
   messages: Message[];
};

const ChatMessages = ({ messages }: chatMessagesProps) => {
   const lastMessageRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
   }, [messages]);

   const onCopy = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   return messages.map((msg, index) => (
      <div
         ref={index === messages.length - 1 ? lastMessageRef : null}
         key={index}
         onCopy={onCopy}
         className={`px-3 py-2 max-w-md rounded-2xl ${msg.role === 'user' ? 'bg-blue-600 text-white self-end' : 'bg-gray-100 text-black self-start'}`}
      >
         <ReactMarkdown>{msg.content}</ReactMarkdown>
      </div>
   ));
};

export default ChatMessages;
