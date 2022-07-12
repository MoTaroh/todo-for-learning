import Layout from "@/components/app/Layout";
import fetcher from "@/lib/fetcher";
import { HttpMethod } from "@/types";
import { Site } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";

interface TaskData {
  id: string | undefined;
  name: string;
  done: boolean;
  removed: boolean;
  siteId: string | string[] | undefined;
}

interface SiteTaskData {
  tasks: Array<TaskData>;
  site: Site | null;
}

export default function SiteTasks() {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { id: siteId } = router.query;

  const { data } = useSWR<SiteTaskData>(
    siteId && `/api/task?siteId=${siteId}`,
    fetcher,
    {
      onSuccess: (data) => {
        !data?.site && router.push("/");
      },
    }
  );

  const [text, setText] = useState("");

  const handleOnSubmit = async () => {
    if (!text) return;

    const newTask: TaskData = {
      id: undefined,
      name: text,
      done: false,
      removed: false,
      siteId: siteId,
    };

    await fetch(`/api/task`, {
      method: HttpMethod.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    });
    mutate(`/api/task?siteId=${siteId}`);

    setText("");
  };
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };
  const handleOnCheck = async (task: TaskData) => {
    const toUpdate = { ...task, done: !task.done };
    await fetch(`/api/task`, {
      method: HttpMethod.PUT,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toUpdate),
    });
    mutate(`/api/task?siteId=${siteId}`);
  };
  const handleOnRemove = async (task: TaskData) => {
    const toRemove = { ...task, removed: !task.removed };
    await fetch(`/api/task`, {
      method: HttpMethod.PUT,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(toRemove),
    });
    mutate(`/api/task?siteId=${siteId}`);
  };

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
          {data ? (
            data.tasks.length > 0 ? (
              <ul className="flex flex-col space-y-2">
                {data.tasks.map((task) => (
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
