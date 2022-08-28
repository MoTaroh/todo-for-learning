import React, { useEffect, useState } from 'react';
import {
  TrashIcon,
  PencilIcon,
  ArrowUturnLeftIcon,
} from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import Badge from './Badge';

interface TaskData {
  readonly id: string | undefined;
  name: string;
  description: string;
  done: boolean;
  removed: boolean;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    color: string;
  } | null;
}
interface Props {
  task: TaskData;
  handleOnCheck: (task: TaskData) => Promise<void>;
  handleOnRemove: (task: TaskData) => Promise<void>;
  handleOnUpdate: (task: TaskData, text: string) => Promise<void>;
}

export default function TaskItem({
  task,
  handleOnCheck,
  handleOnRemove,
  handleOnUpdate,
}: Props) {
  const [editable, setEditable] = useState(false);
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
  const onChecked = () => {
    setChecked(!checked);
    handleOnCheck(task);
  };

  return (
    <div
      onClick={}
      className="flex items-start justify-between p-3 space-x-3 rounded appearance-none cursor-pointer group hover:bg-gray-100 focus-within:outline-none focus-within:border-gray-900 focus-within:ring-gray-900"
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
          <span className="text-lg font-medium text-gray-900">{task.name}</span>
          <span className="text-gray-600">{task.description}</span>
        </div>
      </div>
      {task.category && (
        <Badge name={task.category.name} color={task.category.color}></Badge>
      )}
    </div>
  );
}
