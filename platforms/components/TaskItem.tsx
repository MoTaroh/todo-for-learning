import React, { useEffect, useState } from 'react';
import {
  TrashIcon,
  PencilIcon,
  CheckIcon,
  ReplyIcon,
} from '@heroicons/react/outline';

interface TaskData {
  readonly id: string | undefined;
  name: string;
  done: boolean;
  removed: boolean;
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
    <div className="flex items-center justify-between h-12 p-3 space-x-3 rounded appearance-none group hover:bg-gray-100 focus-within:outline-none focus-within:border-gray-900 focus-within:ring-gray-900">
      <div className="flex items-center flex-1 space-x-3">
        <button
          onClick={onChecked}
          className={`${
            checked
              ? 'text-white bg-gray-900 hover:bg-gray-700'
              : 'text-white hover:text-gray-200 bg-white'
          } w-6 h-6 border border-gray-900 rounded focus:outline-none focus:ring focus:border-white focus:ring-gray-900`}
        >
          <CheckIcon />
        </button>
        {editable ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleOnUpdate(task, text);
              handleEditable();
            }}
            className="flex-1"
          >
            <input
              id="task-input"
              type="text"
              value={text}
              placeholder="Press “Enter” to add a new task..."
              onChange={(e) => handleOnChange(e)}
              onBlur={handleEditable}
              className="w-full h-8 text-lg font-medium border-0 rounded appearance-none focus:outline-none focus:ring-gray-900"
            />
          </form>
        ) : (
          <div className="text-lg font-medium text-gray-900">{task.name}</div>
        )}
        <button
          onClick={handleEditable}
          className="items-center justify-center hidden w-8 h-8 text-gray-900 rounded group-hover:flex hover:bg-gray-200"
        >
          {editable ? (
            <CheckIcon className="w-6 h-6" />
          ) : (
            <PencilIcon className="w-6 h-6" />
          )}
        </button>
      </div>
      <button
        onClick={() => handleOnRemove(task)}
        className={`${
          task.removed
            ? 'bg-green-300 hover:bg-green-200 text-green-600'
            : 'bg-red-300 hover:bg-red-200 text-red-600'
        } group-hover:flex items-center justify-center hidden h-8 w-8 rounded`}
      >
        {task.removed ? (
          <ReplyIcon className="w-6 h-6" />
        ) : (
          <TrashIcon className="w-6 h-6" />
        )}
      </button>
    </div>
  );
}
