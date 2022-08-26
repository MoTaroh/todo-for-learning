import { ChevronDoubleLeftIcon, PlusIcon } from '@heroicons/react/outline';
import Link from 'next/link';
import { useState } from 'react';
import NavigationButton from './NavigationButton';

export default function LeftNavigation() {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(!open);

  const categories = [
    { id: 'id1', name: 'Personal', color: 'green' },
    { id: 'id2', name: 'Work', color: 'blue' },
  ];

  return (
    <div
      className={`flex flex-col justify-between h-full bg-gray-50 ${
        open ? 'w-80 p-6 items-end' : 'w-16 px-2 py-3 items-center'
      }`}
    >
      <div
        className={`flex flex-col w-full ${open ? 'space-y-6' : 'space-y-3'}`}
      >
        <Link href="/tasks">
          <a className="flex items-center p-3 space-x-2 rounded hover:bg-white">
            <span className="text-lg text-gray-900">
              {open ? 'All Tasks' : 'All'}
            </span>
          </a>
        </Link>
        {!open && <div className="w-full h-px bg-gray-200"></div>}
        <div className="">
          {open && (
            <h3 className="px-3 mb-3 font-bold text-gray-500 uppercase">
              Category
            </h3>
          )}
          <ul className="">
            {categories.map((category) => (
              <Link
                href={`/tasks/category/${category.id}`}
                passHref
                key={category.id}
              >
                <a>
                  <NavigationButton
                    color={category.color}
                    text={category.name}
                    open={open}
                  ></NavigationButton>
                </a>
              </Link>
            ))}
            <div className="flex p-3 space-x-2 text-gray-600 hover:bg-white">
              <div>
                <PlusIcon className="w-6 h-6"></PlusIcon>
              </div>
              {open && <div className="text-lg">New Category</div>}
            </div>
          </ul>
        </div>
      </div>
      <button
        className={`p-1 text-gray-400 rounded hover:bg-white hover:text-gray-500 ${
          open ? 'rotate-0' : 'rotate-180'
        }`}
        onClick={handleOpen}
      >
        <ChevronDoubleLeftIcon className="w-6 h-6"></ChevronDoubleLeftIcon>
      </button>
    </div>
  );
}
