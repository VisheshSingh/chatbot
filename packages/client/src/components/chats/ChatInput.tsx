import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';

export type ChatFormData = {
   prompt: string;
};

type ChatInputProps = {
   onSubmit: (data: ChatFormData) => void;
};

const ChatInput = ({ onSubmit }: ChatInputProps) => {
   const { register, reset, handleSubmit, formState } = useForm<ChatFormData>();

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         onChatSubmit();
      }
   };

   const onChatSubmit = handleSubmit((data: ChatFormData) => {
      reset({ prompt: '' });
      onSubmit(data);
   });

   return (
      <form
         onSubmit={onChatSubmit}
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
         <Button disabled={!formState.isValid} className='w-9 h-9 rounded-3xl'>
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatInput;
