import Layout from "@/components/app/Layout";
import fetcher from "@/lib/fetcher";
import { Site } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR from "swr";

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
        createdAt: new Date(),
        updatedAt: new Date(),
        siteId: null,
      },
      {
        id: "id2",
        name: "Task2",
        done: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        siteId: null,
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

  const router = useRouter();
  const { id: siteId } = router.query;

  const { data2 } = useSWR<SiteTaskData>(
    siteId && `/api/task?siteId=${siteId}`,
    fetcher,
    {
      onSuccess: (data) => !data?.site && router.push("/"),
    }
  );
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
              tasks.map((task) => (
                <ul className="flex flex-col" key={task.id}>
                  <li className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      name={task.name}
                      id={task.id}
                      checked={task.done}
                      onChange={() => handleOnCheck(task.id, task.done)}
                        className="h-6 w-6 rounded text-lg text-black focus:border-black"
                      />
                      <label htmlFor={task.name} className="font-cal text-2xl">
                        {task.name}
                      </label>
                  </li>
              </ul>
              ))
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
