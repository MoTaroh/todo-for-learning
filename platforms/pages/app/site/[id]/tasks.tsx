import Layout from "@/components/app/Layout";
import { Site } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";

interface TaskData {
  id: string | undefined;
  name: string;
  done: boolean;
  removed: boolean;
}

interface SiteTaskData {
  tasks: Array<TaskData>;
  site: Site | null;
}

export default function SiteTasks() {
  // dummy data
  const data = {
    site: {
      name: "Mock Site",
    },
    tasks: [
      {
        id: "id1",
        name: "Task1",
        done: true,
        removed: false,
      },
      {
        id: "id2",
        name: "Task2",
        done: false,
        removed: false,
      },
    ],
  };

  const [text, setText] = useState("");
  const [tasks, setTasks] = useState<TaskData[]>(data.tasks);
  const handleOnSubmit = () => {
    if (!text) return;

    const newTask: TaskData = {
      id: undefined,
      name: text,
      done: false,
      removed: false,
    };

    setTasks([newTask, ...tasks]);
    setText("");
  };
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const handleOnCheck = (id: string | undefined, checked: boolean) => {
    const deepCopy = tasks.map((task) => ({ ...task }));

    const newTasks = deepCopy.map((task) => {
      if (task.id === id) {
        task.done = !checked;
      }

      return task;
    });

    setTasks(newTasks);
  };
  const handleOnRemove = (id: string | undefined, removed: boolean) => {
    const deepCopy = tasks.map((task) => ({ ...task }));

    const newTasks = deepCopy.map((task) => {
      if (task.id === id) {
        task.removed = !removed;
      }
      return task;
    });

    setTasks(newTasks);
  };

  const router = useRouter();
  const { id: siteId } = router.query;

  return (
    <Layout>
      <div className="py-20 max-w-screen-xl mx-auto px-10 sm:px-20">
        <div className="flex">
          <h1 className="font-cal text-5xl">
            Tasks for {data ? data?.site?.name : "..."}
          </h1>
        </div>
        <div className="my-10 grid gap-y-8">
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
              className="w-full rounded focus:ring-black"
              onChange={(e) => handleOnChange(e)}
            />
          </form>
          {tasks ? (
            tasks.length > 0 ? (
              <ul className="flex flex-col space-y-2">
                {tasks.map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between rounded group hover:bg-gray-100 h-16 px-3"
                  >
                    <div className="flex items-center  space-x-4">
                      <input
                        type="checkbox"
                        name={task.name}
                        id={task.id}
                        disabled={task.removed}
                        checked={task.done}
                        onChange={() => handleOnCheck(task.id, task.done)}
                        className="h-6 w-6 rounded text-lg text-black focus:border-black"
                      />
                      <label htmlFor={task.name} className="font-cal text-2xl">
                        {task.name}
                      </label>
                    </div>
                    <button
                      onClick={() => handleOnRemove(task.id, task.removed)}
                      className={`${
                        task.removed
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      } group-hover:block hidden  text-white px-4 py-2 rounded `}
                    >
                      {task.removed ? "Restore" : "Delete"}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div>no tasks</div>
            )
          ) : (
            [0, 1].map((i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:h-60 rounded-lg overflow-hidden border border-gray-200"
              >
                <div className="relative w-full h-60 md:h-auto md:w-1/3 md:flex-none bg-gray-300 animate-pulse" />
                <div className="relative p-10 grid gap-5">
                  <div className="w-28 h-10 rounded-md bg-gray-300 animate-pulse" />
                  <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                  <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                  <div className="w-48 h-6 rounded-md bg-gray-300 animate-pulse" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
