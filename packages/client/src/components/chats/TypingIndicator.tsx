type Props = {
   className?: string;
};

const TypingIndicator = () => {
   return (
      <div className='flex gap-1 p-3 bg-gray-200 rounded-2xl self-start'>
         <Dot />
         <Dot className='[animation-delay:0.2s]'></Dot>
         <Dot className='[animation-delay:0.4s]'></Dot>
      </div>
   );
};

const Dot = ({ className }: Props) => (
   <div
      className={`w-2 h-2 rounded-full bg-gray-800 text-black animate-pulse ${className}`}
   ></div>
);

export default TypingIndicator;
