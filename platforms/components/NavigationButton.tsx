import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
interface Props {
  color: string;
  text: string;
  open: boolean;
}

export default function NavigationButton({ color, text, open }: Props) {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const bgColor = 'bg-' + color + '-600';

  return (
    <a
      className={`flex h-14 group items-center justify-center px-3 space-x-2 rounded hover:bg-white ${
        !open && 'w-12 h-12'
      }`}
    >
      <div
        className={`${open ? 'w-3 h-3' : 'w-5 h-5'} ${bgColor} rounded-full`}
      ></div>
      {open && <span className="flex-1 text-lg text-gray-900">{text}</span>}
      {open && (
        <button
          onClick={handleClick}
          className="items-center justify-center hidden w-8 h-8 text-gray-900 rounded group-hover:flex hover:bg-gray-50"
        >
          <EllipsisHorizontalIcon className="w-6 h-6"></EllipsisHorizontalIcon>
        </button>
      )}
    </a>
  );
}
