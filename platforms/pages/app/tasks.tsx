import Layout from '@/components/app/Layout';
import TaskItem from '@/components/TaskItem';
import { HttpMethod } from '@/types';
import { useEffect, useState } from 'react';

interface TaskData {
  readonly id: string | undefined;
  name: string;
  done: boolean;
  removed: boolean;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch('/api/tasks');

      if (res.ok) {
        const fetchedTasks = await res.json();

        setTasks(fetchedTasks);
        setIsLoading(false);

        return;
      }
      console.error(res);
    }

    fetchTasks();
  }, []);

  const handleOnSubmit = async () => {
    if (!text) return;

    const newTask: TaskData = {
      id: undefined,
      name: text,
      done: false,
      removed: false,
    };

    const res = await fetch(`/api/tasks`, {
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });
    if (res.ok) {
      const createdTask = await res.json();
      const newTasks = [createdTask, ...tasks];
      setText('');
      setTasks(newTasks);
    } else {
      console.error(`Error occured: ${JSON.stringify(res)}`);
    }
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleOnCheck = async (task: TaskData) => {
    const toUpdate = { ...task, done: !task.done };
    fetch(`/api/tasks/${task.id}/done`, {
      method: HttpMethod.PATCH,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toUpdate),
    });
    const newTasks = tasks.map((t) => {
      if (t.id === task.id) {
        return toUpdate;
      }
      return t;
    });

    setTasks(newTasks);
  };

  const handleOnRemove = async (task: TaskData) => {
    const toRemove = { ...task, removed: !task.removed };
    fetch(`/api/tasks/${task.id}/removed`, {
      method: HttpMethod.PATCH,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toRemove),
    });
    const newTasks = tasks.map((t) => {
      if (t.id === task.id) {
        return toRemove;
      }
      return t;
    });

    setTasks(newTasks);
  };

  const removedTasks = tasks.filter((task) => {
    return task.removed;
  });
  const notRemovedTasks = tasks.filter((task) => {
    return !task.removed;
  });

  return (
    <Layout>
      <div className="max-w-screen-xl px-10 py-20 mx-auto sm:px-20">
        <div className="flex">
          <h1 className="text-5xl font-cal">My Tasks</h1>
        </div>
        <div className="grid my-10 gap-y-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleOnSubmit();
            }}
          >
            <input
              type="text"
              value={text}
              placeholder="Add new task"
              className="w-full rounded appearance-none focus:outline-none focus:ring-black focus:border-black "
              onChange={(e) => handleOnChange(e)}
            />
          </form>
          {!isLoading ? (
            tasks.length > 0 ? (
              <div className="flex flex-col space-y-12">
                <div>
                  {notRemovedTasks.length > 0 ? (
                    <ul className="flex flex-col space-y-2">
                      {notRemovedTasks.map((task) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          handleOnCheck={handleOnCheck}
                          handleOnRemove={handleOnRemove}
                        ></TaskItem>
                      ))}
                      {removedTasks.length > 0 ? (
                        <ul>
                          {removedTasks.map((task) => {
                            <li>{task.name}</li>;
                          })}
                        </ul>
                      ) : (
                        <></>
                      )}
                    </ul>
                  ) : (
                    <div>well done!</div>
                  )}
                </div>
                <div>
                  <h3 className="mb-2 text-2xl font-cal">Trashes</h3>
                  {removedTasks.length > 0 ? (
                    <ul className="flex flex-col space-y-2">
                      {removedTasks.map((task) => (
                        <li
                          key={task.id}
                          className="flex items-center justify-between h-16 px-3 rounded group hover:bg-gray-100"
                        >
                          <div className="flex items-center space-x-4">
                            <input
                              type="checkbox"
                              name={task.name}
                              id={task.id}
                              disabled={task.removed}
                              checked={task.done}
                              onChange={() => handleOnCheck(task)}
                              className="w-6 h-6 text-lg text-black rounded focus:border-black"
                            />
                            <label
                              htmlFor={task.name}
                              className="text-2xl font-cal"
                            >
                              {task.name}
                            </label>
                          </div>
                          <button
                            onClick={() => handleOnRemove(task)}
                            className={`${
                              task.removed
                                ? 'bg-green-500 hover:bg-green-600'
                                : 'bg-red-500 hover:bg-red-600'
                            } group-hover:block hidden  text-white px-4 py-2 rounded `}
                          >
                            {task.removed ? 'Restore' : 'Delete'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
            ) : (
              <div>no tasks</div>
            )
          ) : (
            [0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded animate-pulse" />
                <div className="w-full h-10 bg-gray-300 rounded animate-pulse" />
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
