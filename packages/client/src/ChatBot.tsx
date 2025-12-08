import { FaArrowUp } from 'react-icons/fa';
import { Button } from './components/ui/button';
import { useForm } from 'react-hook-form';

type FormData = {
   prompt: string;
};

const ChatBot = () => {
   const { register, reset, handleSubmit, formState } = useForm<FormData>();

   const onSubmit = (data: FormData) => {
      console.log(data);
      reset();
   };

   const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
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
         <Button disabled={!formState.isValid} className='w-9 h-9 rounded-3xl'>
            <FaArrowUp />
         </Button>
      </form>
   );
};

export default ChatBot;
