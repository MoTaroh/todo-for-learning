import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { CategoryData } from '@/types/category';
import Circle from './atom/Circle';

interface Props {
  categories: CategoryData[];
}

export default function ListBox({ categories }: Props) {
  const [selected, setSelected] = useState<CategoryData>(categories[0]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className="relative mr-2 w-52">
        <Listbox.Button className="flex items-center justify-between w-full px-3 bg-gray-100 rounded h-9 focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
          <div className="flex items-center space-x-2">
            {selected.id !== 'default' && (
              <div
                className={`w-3 h-3 rounded-full bg-${selected.color}-600`}
              ></div>
            )}
            <span
              className={`font-base truncate ${
                selected.id === 'default' ? 'text-gray-400' : 'text-gray-900'
              }`}
            >
              {selected.name}
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
            {categories.map((category) => (
              <Listbox.Option
                key={category.id}
                value={category}
                className="text-gray-900"
              >
                {({ active, selected }) => (
                  <div
                    className={`flex items-center text-sm px-3 py-2 cursor-default select-none ${
                      active ? 'bg-gray-100' : 'bg-white '
                    }`}
                  >
                    <Circle size={'small'} color={category.color}></Circle>
                    <span
                      className={`ml-2 truncate ${
                        selected ? 'font-medium' : 'font-base'
                      }`}
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