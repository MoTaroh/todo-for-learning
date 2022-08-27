import { ChevronDownIcon } from '@heroicons/react/20/solid';
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

  const handleOnUpdate = async (task: TaskData, name: string) => {
    // for api
    const toUpdate = { name: name };
    // for view
    const updated = { ...task, name: name };
    fetch(`/api/tasks/${task.id}`, {
      method: HttpMethod.PUT,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toUpdate),
    });
    const newTasks = tasks.map((t) => {
      if (t.id === task.id) {
        return updated;
      }
      return t;
    });

    setTasks(newTasks);
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

  const removedTasks = tasks
    .filter((task) => {
      return task.removed;
    })
    .sort((t1, t2) => {
      if (t1.done > t2.done) {
        return 1;
      }
      if (t1.done < t2.done) {
        return -1;
      }
      return 0;
    });
  const notRemovedTasks = tasks
    .filter((task) => {
      return !task.removed;
    })
    .sort((t1, t2) => {
      if (t1.done > t2.done) {
        return 1;
      }
      if (t1.done < t2.done) {
        return -1;
      }
      return 0;
    });

  return (
    <Layout>
      <div className="flex flex-col h-full max-w-screen-xl p-10 mx-auto sm:px-20">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <div className="flex flex-col h-full mt-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleOnSubmit();
            }}
          >
            <div className="relative w-full mb-6 overflow-hidden border border-gray-600 divide-y divide-gray-600 rounded divide-dotted">
              <div className="relative">
                <input
                  type="text"
                  value={text}
                  placeholder="Press “Enter” to add a new task."
                  className="w-full p-3 border-0 appearance-none placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  onChange={(e) => handleOnChange(e)}
                />
                <button className="absolute flex items-center justify-between h-8 px-3 text-gray-400 transform -translate-y-1/2 bg-gray-100 w-52 top-1/2 right-3">
                  <span>No Category</span>
                  <ChevronDownIcon className="w-5 h-5 text-gray-600"></ChevronDownIcon>
                </button>
              </div>
              <input
                type="text"
                value={text}
                placeholder="Description"
                className="w-full p-3 border-0 appearance-none placeholder:text-gray-400 focus:outline-none focus:ring-0"
                onChange={(e) => handleOnChange(e)}
              />
            </div>
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
                          handleOnUpdate={handleOnUpdate}
                        ></TaskItem>
                      ))}
                    </ul>
                  ) : (
                    <div>well done!</div>
                  )}
                </div>
                <div>
                  {removedTasks.length > 0 ? (
                    <>
                      <h3 className="mb-3 text-xl font-bold">Trashes</h3>
                      <ul className="flex flex-col space-y-2">
                        {removedTasks.map((task) => (
                          <TaskItem
                            key={task.id}
                            task={task}
                            handleOnCheck={handleOnCheck}
                            handleOnRemove={handleOnRemove}
                            handleOnUpdate={handleOnUpdate}
                          ></TaskItem>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 w-full mt-6 bg-center bg-no-repeat bg-contain rounded bg-gray-50 bg-blank-task"></div>
            )
          ) : (
            [0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center mb-4 space-x-4">
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
