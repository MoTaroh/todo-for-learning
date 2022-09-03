import React, { useState } from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import Badge from './atom/Badge';
import { TaskData } from '@/types/task';
import { CategoryData } from '@/types/category';

interface TaskResponse extends TaskData {
  category: CategoryData | null;
}
interface Props {
  task: TaskResponse;
  handleOnCheck: (task: TaskResponse) => Promise<void>;
  handleOnClick: (task: TaskResponse) => void;
}

export default function TaskItem({
  task,
  handleOnCheck,
  handleOnClick,
}: Props) {
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
        onClick={() => handleOnClick(task)}
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
    </>
  );
}
