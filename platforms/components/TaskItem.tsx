import React, { useEffect, useState } from 'react';
import {
  TrashIcon,
  PencilIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import Badge from './atom/Badge';
import { TaskData } from '@/types/task';
import { CategoryData } from '@/types/category';
import { Dialog } from '@headlessui/react';
import TextInput from './atom/TextInput';
import ListBoxInput from './ListBoxInput';

interface TaskResponse extends TaskData {
  category: CategoryData | null;
}
interface Props {
  task: TaskResponse;
  handleOnCheck: (task: TaskResponse) => Promise<void>;
  handleOnRemove: (task: TaskResponse) => Promise<void>;
  handleOnUpdate: (task: TaskResponse, text: string) => Promise<void>;
}

// This will fetched from API
const categories: CategoryData[] = [
  { id: 'default', name: 'Select Category', color: 'gray' },
  { id: 'test', name: 'Personal', color: 'blue' },
];

export default function TaskItem({
  task,
  handleOnCheck,
  handleOnRemove,
  handleOnUpdate,
}: Props) {
  const [editable, setEditable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const handleDialog = () => setIsOpen(!isOpen);
  const handleEditable = () => setEditable(!editable);

  useEffect(() => {
    if (editable === true) {
      const input = document.getElementById('task-input');
      input?.focus();
    }
  }, [editable]);

  const [text, setText] = useState(task.name);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const [checked, setChecked] = useState(task.done);
  const onChecked = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.log(e);

    e.stopPropagation();
    setChecked(!checked);
    handleOnCheck(task);
  };

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="flex items-start justify-between p-3 space-x-3 rounded appearance-none cursor-pointer group hover:bg-gray-100 "
      >
        <div className="flex items-start flex-1 space-x-3">
          <button
            onClick={onChecked}
            disabled={task.removed}
            className={`${
              checked
                ? 'text-white bg-gray-900 hover:bg-gray-700'
                : 'text-white hover:text-gray-200 bg-white'
            } ${
              task.removed
                ? 'cursor-not-allowed'
                : 'focus:outline-none focus:ring focus:border-white focus:ring-gray-900'
            } w-6 h-6 mt-[2px] border border-gray-900 rounded `}
          >
            <CheckIcon />
          </button>
          <div className="flex flex-col space-y-1">
            <span className="text-lg text-gray-900">{task.name}</span>
            <span className="text-gray-600">{task.description}</span>
          </div>
        </div>
        {task.category && (
          <Badge name={task.category.name} color={task.category.color}></Badge>
        )}
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          {/* The actual dialog panel  */}
          <Dialog.Panel className="max-w-xl sm:w-[560px] px-12 pt-12 pb-6 mx-auto space-y-8 text-gray-900 bg-white rounded-md">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-2xl font-bold">
                Edit Task
              </Dialog.Title>
              <button className="flex items-center justify-center p-2 text-red-600 rounded hover:bg-red-200">
                <TrashIcon className="w-6 h-6"></TrashIcon>
              </button>
            </div>

            <div className="flex flex-col w-full space-y-6">
              <div className="flex flex-col justify-start space-y-2">
                <label htmlFor="name" className="text-sm font-bold">
                  Name
                </label>
                <TextInput id={'name'} placeholder={'Task Name'}></TextInput>
              </div>
              <div className="flex flex-col justify-start space-y-2">
                <label htmlFor="description" className="text-sm font-bold">
                  Description
                </label>
                <TextInput
                  id={'description'}
                  placeholder={'Task Description'}
                ></TextInput>
              </div>
              <div className="flex flex-col justify-start space-y-2">
                <label htmlFor="category" className="text-sm font-bold">
                  Category
                </label>
                <ListBoxInput categories={categories}></ListBoxInput>
              </div>
            </div>
            <div className="flex justify-center space-x-12">
              <button className="w-24 px-4 py-3 text-lg font-semibold text-center text-gray-900 rounded hover:text-gray-700">
                Cancel
              </button>
              <button className="w-24 px-4 py-3 text-lg font-semibold text-center text-white bg-gray-900 rounded hover:bg-gray-700">
                Apply
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
