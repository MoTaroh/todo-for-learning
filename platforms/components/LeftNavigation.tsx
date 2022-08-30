import { CategoryData } from '@/types/category';
import { Dialog } from '@headlessui/react';
import {
  ChevronDoubleLeftIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import TextInput from './atom/TextInput';
import ColorRadioGroup from './ColorRadioGroup';
import ListBoxInput from './ListBoxInput';
import NavigationButton from './NavigationButton';

export default function LeftNavigation() {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(!open);
  const [dialogOpen, setDialogOpen] = useState(false);

  const categories: CategoryData[] = [
    { id: 'id1', name: 'Personal', color: 'green' },
    { id: 'id2', name: 'Work', color: 'blue' },
  ];

  return (
    <>
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
              <button
                onClick={() => setDialogOpen(true)}
                className="flex w-full p-3 space-x-2 text-gray-600 hover:bg-white"
              >
                <div>
                  <PlusIcon className="w-6 h-6"></PlusIcon>
                </div>
                {open && <div className="text-lg">New Category</div>}
              </button>
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
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="max-w-xl px-12 pt-12 pb-6 mx-auto space-y-12 text-gray-900 bg-white rounded-md">
            <Dialog.Title className="text-2xl font-bold">
              Add New Category
            </Dialog.Title>

            <div className="flex flex-col w-full space-y-6">
              <div className="flex flex-col justify-start space-y-2">
                <label htmlFor="category-name" className="text-sm font-bold">
                  Name
                </label>
                <TextInput
                  id={'category-name'}
                  placeholder={'Category Name'}
                ></TextInput>
              </div>
              <div className="flex flex-col justify-start space-y-2">
                <ColorRadioGroup></ColorRadioGroup>
              </div>
            </div>
            <div className="flex justify-center space-x-12">
              <button className="w-24 px-4 py-3 text-lg font-semibold text-center text-gray-900 rounded hover:text-gray-700">
                Cancel
              </button>
              <button className="w-24 px-4 py-3 text-lg font-semibold text-center text-white bg-gray-900 rounded hover:bg-gray-700">
                Add
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
