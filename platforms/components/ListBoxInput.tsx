import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { CategoryData } from '@/types/category';
import Circle from './atom/Circle';

interface Props {
  categories: CategoryData[];
  value: CategoryData | null;
  onChange: Dispatch<SetStateAction<CategoryData | null>>;
}
const nullCategory: CategoryData = {
  id: 'default',
  name: 'No Category',
  color: 'gray',
};

export default function ListBox({ categories, value, onChange }: Props) {
  if (!value) {
    value = nullCategory;
  }
  const categoryList = [nullCategory, ...categories];

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative w-full">
        <Listbox.Button className="flex items-center justify-between w-full p-3 bg-white border border-gray-900 rounded focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-base">
          <div className="flex items-center space-x-2">
            {value.id !== 'default' && (
              <div
                className={`w-3 h-3 rounded-full bg-${value.color}-600`}
              ></div>
            )}
            <span
              className={`font-base truncate ${
                value.id === 'default' ? 'text-gray-400' : 'text-gray-900'
              }`}
            >
              {value.name}
            </span>
          </div>
          <span className="flex items-center pointer-events-none">
            <ChevronDownIcon
              className="w-5 h-5 text-gray-600"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto bg-white rounded shadow max-h-60 focus:outline-none">
            {categoryList.map((category) => (
              <Listbox.Option
                key={category.id}
                value={category}
                className="text-gray-900"
              >
                {({ active, selected }) => (
                  <div
                    className={`flex items-center text-base px-3 py-2 cursor-default select-none ${
                      active ? 'bg-gray-100' : 'bg-white '
                    }`}
                  >
                    {category.id !== 'default' && (
                      <Circle size={'small'} color={category.color}></Circle>
                    )}
                    <span
                      className={`ml-2 truncate ${
                        selected ? 'font-medium' : 'font-base'
                      } ${category.id === 'default' && 'ml-5'}`}
                    >
                      {category.name}
                    </span>
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
