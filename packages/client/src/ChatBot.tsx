import { FaArrowUp } from 'react-icons/fa';
import { Button } from './components/ui/button';

const ChatBot = () => {
   return (
      <div className='flex flex-col gap-2 items-end border-2 p-4 rounded-3xl'>
         <textarea
            placeholder='Ask anything...'
            className='w-full p-2 border-0 focus:outline-0 resize-none'
         />
         <Button className='w-9 h-9 rounded-3xl'>
            <FaArrowUp />
         </Button>
      </div>
   );
};

export default ChatBot;
