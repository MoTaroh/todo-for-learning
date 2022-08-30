import { ColorUnion } from '@/types/colorUnion';
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import Circle from './atom/Circle';
interface Props {
  color: ColorUnion;
  text: string;
  open: boolean;
}

export default function NavigationButton({ color, text, open }: Props) {
  const [click, setClick] = useState(false);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setClick(!click);
  };

  return (
    <div
      className={`flex h-14 group items-center justify-center px-3 space-x-2 rounded hover:bg-white ${
        !open && 'w-12 h-12'
      }`}
    >
      <Circle size={open ? 'small' : 'big'} color={color}></Circle>
      {open && <span className="flex-1 text-lg text-gray-900">{text}</span>}
      {open && (
        <button
          onClick={handleClick}
          className="items-center justify-center hidden w-8 h-8 text-gray-900 rounded group-hover:flex hover:bg-gray-50"
        >
          <EllipsisHorizontalIcon className="w-6 h-6"></EllipsisHorizontalIcon>
        </button>
      )}
    </div>
  );
}
