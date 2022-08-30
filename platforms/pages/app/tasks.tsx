import Layout from '@/components/app/Layout';
import TaskItem from '@/components/TaskItem';
import { HttpMethod } from '@/types';
import { useEffect, useState } from 'react';
import { CategoryData } from '@/types/category';
import { TaskData } from '@/types/task';
import ListBox from '@/components/ListBox';

interface TaskResponse extends TaskData {
  category: CategoryData | null;
}

export default function Tasks() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [categories, setCategories] = useState<CategoryData[]>([]);

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch('/api/tasks');

      if (res.ok) {
        const fetchedTasks: TaskResponse[] = await res.json();

        setTasks(fetchedTasks);
        setIsLoading(false);

        return;
      }
      console.error(res);
    }
    async function fetchCategories() {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const fetchedCategories: CategoryData[] = await res.json();
        setCategories(fetchedCategories);

        return;
      }
      console.error(res);
    }

    fetchTasks();
    fetchCategories();
  }, []);

  const handleOnSubmit = async () => {
    if (!taskName) return;

    const newTask: TaskData = {
      id: undefined,
      name: taskName,
      description: taskDescription,
      done: false,
      removed: false,
      categoryId: null,
    };

    const res = await fetch(`/api/tasks`, {
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });
    if (res.ok) {
      const createdTask: TaskResponse = await res.json();
      const newTasks = [createdTask, ...tasks];
      setTaskName('');
      setTaskDescription('');
      setTasks(newTasks);
    } else {
      console.error(`Error occured: ${JSON.stringify(res)}`);
    }
  };

  const handleOnUpdate = async (task: TaskData, name: string) => {
    // for api
    // const toUpdate = { name: name };
    // // for view
    // const updated = { ...task, name: name };
    // fetch(`/api/tasks/${task.id}`, {
    //   method: HttpMethod.PUT,
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(toUpdate),
    // });
    // const newTasks = tasks.map((t) => {
    //   if (t.id === task.id) {
    //     return updated;
    //   }
    //   return t;
    // });
    // setTasks(newTasks);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.id) {
      case 'taskName':
        setTaskName(e.target.value);
        break;
      case 'taskDescription':
        setTaskDescription(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleOnCheck = async (task: TaskResponse) => {
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

  const handleOnRemove = async (task: TaskResponse) => {
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
            <div className="w-full mb-6 text-gray-900 border border-gray-600 divide-y divide-gray-600 rounded divide-dotted">
              <div className="flex items-center">
                <input
                  id="taskName"
                  type="text"
                  value={taskName}
                  placeholder="Press “Enter” to add a new task."
                  className="flex-1 p-3 border-0 rounded-t appearance-none placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  onChange={(e) => handleOnChange(e)}
                />
                <ListBox
                  categories={[
                    { id: 'default', name: 'No Category', color: 'gray' },
                    { id: 'default2', name: 'No Category2', color: 'blue' },
                    ...categories,
                  ]}
                ></ListBox>
              </div>
              <input
                id="taskDescription"
                type="text"
                value={taskDescription}
                placeholder="Description"
                className="w-full p-3 border-0 rounded-b appearance-none placeholder:text-gray-400 focus:outline-none focus:ring-0"
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
