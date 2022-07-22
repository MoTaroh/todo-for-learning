import Layout from "@/components/app/Layout";
import { HttpMethod } from "@/types";
import { useEffect, useState } from "react";

interface TaskData {
  readonly id: string | undefined;
  name: string;
  done: boolean;
  removed: boolean;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch("/api/tasks");
      console.log(res);

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
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
    if (res.ok) {
      const createdTask = await res.json();
      const newTasks = [createdTask, ...tasks];
      setText("");
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
        "Content-Type": "application/json",
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
        "Content-Type": "application/json",
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

  return (
    <Layout>
      <div className="py-20 max-w-screen-xl mx-auto px-10 sm:px-20">
        <div className="flex">
          <h1 className="font-cal text-5xl">My Tasks</h1>
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
          {!isLoading ? (
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
                        onChange={() => handleOnCheck(task)}
                        className="h-6 w-6 rounded text-lg text-black focus:border-black"
                      />
                      <label htmlFor={task.name} className="font-cal text-2xl">
                        {task.name}
                      </label>
                    </div>
                    <button
                      onClick={() => handleOnRemove(task)}
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
            [0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex space-x-4 items-center">
                <div className="w-10 h-10 rounded bg-gray-300 animate-pulse" />
                <div className="w-full h-10 rounded bg-gray-300 animate-pulse" />
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
