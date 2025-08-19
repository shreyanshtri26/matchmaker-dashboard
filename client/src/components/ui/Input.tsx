import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

const Input: React.FC<InputProps> = ({ className = '', ...props }) => {
  return (
    <input
      className={`px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 ${className}`}
      {...props}
    />
  );
};

export default Input;