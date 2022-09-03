import Layout from '@/components/app/Layout';
import TaskItem from '@/components/TaskItem';
import { HttpMethod } from '@/types';
import { useEffect, useState } from 'react';
import { CategoryData } from '@/types/category';
import { TaskData } from '@/types/task';
import ListBox from '@/components/ListBox';
import { createTask, fetchTasks, removeTask, updateTask } from '@/lib/taskApi';
import { fetchCategories } from '@/lib/categoryApi';
import { Dialog } from '@headlessui/react';
import TextInput from '@/components/atom/TextInput';
import { TrashIcon } from '@heroicons/react/24/outline';
import ListBoxInput from '@/components/ListBoxInput';

interface TaskResponse extends TaskData {
  category: CategoryData | null;
}

export default function Tasks() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showModal, toggleShowModal] = useState<boolean>(false);
  const [tasks, setTasks] = useState<TaskResponse[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  // This is for main input
  const [inputTaskName, setInputTaskName] = useState('');
  const [inputTaskDescription, setInputTaskDescription] = useState('');
  // This is for each input
  const [selectedTask, selectTask] = useState<TaskData | null>(null);
  const [selectedTaskName, selectTaskName] = useState('');
  const [selectedTaskDescription, selectTaskDescription] = useState('');
  const [selectedCategory, selectCategory] = useState<CategoryData | null>(
    null
  );

  const cancelModal = () => {
    toggleShowModal(false);
    resetModalInput();
  };
  const selectTaskItem = (task: TaskResponse) => {
    selectTask(task);
    selectTaskName(task.name || '');
    selectTaskDescription(task.description || '');
    selectCategory(task.category);
    toggleShowModal(true);
  };
  const resetModalInput = () => {
    selectTaskName('');
    selectTaskDescription('');
    selectCategory(null);
  };
  const resetCreateInput = () => {
    setInputTaskName('');
    setInputTaskDescription('');
    selectCategory(null);
  };

  useEffect(() => {
    async function initial() {
      const fetchedTasks: TaskResponse[] = await fetchTasks();
      const fetchedCategories: CategoryData[] = await fetchCategories();
      setIsLoading(false);
      setTasks(fetchedTasks);
      setCategories(fetchedCategories);
    }

    initial();
  }, []);

  const onCreateTask = async () => {
    if (!inputTaskName) return;
    // set categoryId
    let categoryId = null;
    if (
      !selectedCategory ||
      !selectedCategory.id ||
      selectedCategory.id === 'default'
    ) {
      categoryId = null;
    } else {
      categoryId = selectedCategory.id;
    }

    const newTask: TaskData = {
      id: undefined,
      name: inputTaskName,
      description: inputTaskDescription,
      done: false,
      removed: false,
      categoryId: categoryId,
    };

    const createdTask: TaskResponse = await createTask(newTask);
    const newTasks = [createdTask, ...tasks];
    resetCreateInput();
    setTasks(newTasks);
  };
  const onUpdateTask = async () => {
    if (!selectedTask || !selectedTaskName) return;
    // set categoryId
    let categoryId = null;
    if (
      !selectedCategory ||
      !selectedCategory.id ||
      selectedCategory.id === 'default'
    ) {
      categoryId = null;
    } else {
      categoryId = selectedCategory.id;
    }

    const toUpdate: TaskData = {
      id: selectedTask.id,
      name: selectedTaskName,
      description: selectedTaskDescription,
      done: selectedTask.done,
      removed: selectedTask.removed,
      categoryId: categoryId,
    };

    const updated = await updateTask(toUpdate);
    const newTasks = tasks.map((task) => {
      if (task.id === updated.id) return updated;
      return task;
    });
    cancelModal();
    setTasks(newTasks);
  };
  const onDeleteTask = async () => {
    if (!selectedTask) return;
    const toRemove: TaskData = {
      ...selectedTask,
      removed: !selectedTask.removed,
    };
    const status = await removeTask(toRemove);
    if (status === 204) {
      const fetchedTasks: TaskResponse[] = await fetchTasks();
      setTasks(fetchedTasks);
      cancelModal();
    } else {
      console.error('Error occured when removing category');
    }
  };

  const onChangeTextInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    switch (e.target.id) {
      case 'mainTaskName':
        setInputTaskName(e.target.value);
        break;
      case 'mainTaskDescription':
        setInputTaskDescription(e.target.value);
        break;
      case 'name':
        selectTaskName(e.target.value);
        break;
      case 'description':
        selectTaskDescription(e.target.value);
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
              onCreateTask();
            }}
          >
            <div className="w-full text-gray-900 border border-gray-600 divide-y divide-gray-600 rounded divide-dotted">
              <div className="flex items-center">
                <input
                  id="mainTaskName"
                  type="text"
                  value={inputTaskName}
                  placeholder="Press “Enter” to add a new task."
                  className="flex-1 p-3 border-0 rounded-t appearance-none placeholder:text-gray-400 focus:outline-none focus:ring-0"
                  onChange={(e) => onChangeTextInput(e)}
                />
                <ListBox
                  categories={categories}
                  value={selectedCategory}
                  onChange={selectCategory}
                ></ListBox>
              </div>
              <input
                id="mainTaskDescription"
                type="text"
                value={inputTaskDescription}
                placeholder="Description"
                className="w-full p-3 border-0 rounded-b appearance-none placeholder:text-gray-400 focus:outline-none focus:ring-0"
                onChange={(e) => onChangeTextInput(e)}
              />
            </div>
            <div className="flex items-center justify-end mt-2 mb-6 space-x-3">
              <button
                type="reset"
                onClick={resetCreateInput}
                className="px-3 py-2 font-bold text-gray-900 bg-white rounded hover:text-gray-700"
              >
                Clear
              </button>
              <button
                type="submit"
                className="px-3 py-2 font-bold text-white bg-gray-900 rounded hover:bg-gray-700"
              >
                Add Task
              </button>
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
                          handleOnClick={(task) => selectTaskItem(task)}
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
                            handleOnClick={(task) => selectTaskItem(task)}
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
      {/* ダイアログオープン時にCategoriesを取得すべき or もう一段上でstate管理すべき */}
      {showModal && (
        <Dialog
          open={showModal}
          onClose={cancelModal}
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
                <button
                  onClick={onDeleteTask}
                  className="flex items-center justify-center p-2 text-red-600 rounded hover:bg-red-200"
                >
                  <TrashIcon className="w-6 h-6"></TrashIcon>
                </button>
              </div>

              <div className="flex flex-col w-full space-y-6">
                <div className="flex flex-col justify-start space-y-2">
                  <label htmlFor="name" className="text-sm font-bold">
                    Name
                  </label>
                  <TextInput
                    id={'name'}
                    placeholder={'Task Name'}
                    value={selectedTaskName}
                    onChange={onChangeTextInput}
                  ></TextInput>
                </div>
                <div className="flex flex-col justify-start space-y-2">
                  <label htmlFor="description" className="text-sm font-bold">
                    Description
                  </label>
                  <TextInput
                    id={'description'}
                    placeholder={'Task Description'}
                    value={selectedTaskDescription}
                    onChange={onChangeTextInput}
                  ></TextInput>
                </div>
                <div className="flex flex-col justify-start space-y-2">
                  <label htmlFor="category" className="text-sm font-bold">
                    Category
                  </label>
                  <ListBoxInput
                    categories={categories}
                    value={selectedCategory}
                    onChange={selectCategory}
                  ></ListBoxInput>
                </div>
              </div>
              <div className="flex justify-center space-x-12">
                <button
                  onClick={cancelModal}
                  className="w-24 px-4 py-3 text-lg font-semibold text-center text-gray-900 rounded hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={onUpdateTask}
                  className="w-24 px-4 py-3 text-lg font-semibold text-center text-white bg-gray-900 rounded hover:bg-gray-700"
                >
                  Apply
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </Layout>
  );
}
