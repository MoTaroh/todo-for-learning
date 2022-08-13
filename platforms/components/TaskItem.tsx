import React, { useState } from 'react';

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

  const [text, setText] = useState(task.name);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="flex items-center justify-between h-12 p-3 rounded appearance-none group hover:bg-gray-100 focus-within:outline-none focus-within:border-gray-900 focus-within:ring-gray-900">
      <div className="flex items-center flex-1 space-x-3">
        <input
          type="checkbox"
          name={task.name}
          id={task.id}
          disabled={task.removed}
          checked={task.done}
          onChange={() => handleOnCheck(task)}
          className="w-6 h-6 text-lg text-gray-900 rounded cursor-pointer hover:bg-gray-200 focus:ring focus:ring-gray-900 focus:border-gray-900"
        />
        {editable ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleOnUpdate(task, text);
              handleEditable();
            }}
          >
            <input
              type="text"
              value={text}
              placeholder="Add new task"
              onChange={(e) => handleOnChange(e)}
              className="text-lg font-medium focus:outline-none group-hover:bg-gray-100 "
            />
          </form>
        ) : (
          <div className="text-lg font-medium text-gray-900">{task.name}</div>
        )}
        <button
          onClick={handleEditable}
          className="items-center justify-center hidden w-8 h-8 text-gray-900 rounded group-hover:flex hover:bg-gray-200"
        >
          {editable ? 'C' : 'E'}
        </button>
      </div>
      <button
        onClick={() => handleOnRemove(task)}
        className={`${
          task.removed
            ? 'bg-green-300 hover:bg-green-200 text-green-600'
            : 'bg-red-300 hover:bg-red-200 text-red-600'
        } group-hover:block hidden h-8 w-8 rounded `}
      >
        {task.removed ? 'R' : 'D'}
      </button>
    </div>
  );
}
