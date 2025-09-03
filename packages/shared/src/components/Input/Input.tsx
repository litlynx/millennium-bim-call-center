import React from 'react';
import Icon from '@/components/Icon';

interface InputProps {
  name?: string;
  placeholder?: string;
}

const Input: React.FC<InputProps> = ({ name, placeholder }) => {
  const [text, setText] = React.useState('');

  return (
    <div className="relative">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        name={name}
        placeholder={placeholder}
        className="bg-gray-100 text-gray-800 text-sm border-b border-gray-800 py-2 pl-2 pr-8 w-full"
      />
      <Icon
        type="closeBlack"
        className="cursor-pointer absolute h-fit w-fit p-0 right-2 top-1/2 -translate-y-1/2"
        onClick={() => setText('')}
      />
    </div>
  );
};

export default Input;
