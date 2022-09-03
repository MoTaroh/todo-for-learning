import { HttpMethod } from '@/types';
import { TaskData } from '@/types/task';

export const fetchTasks = async () => {
  const res = await fetch('/api/tasks');
  if (res.ok) {
    return await res.json();
  } else {
    console.error(res);
    return [{}];
  }
};

export const createTask = async (task: TaskData) => {
  const res = await fetch('/api/tasks', {
    method: HttpMethod.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });

  if (res.ok) {
    return await res.json();
  } else {
    console.error(res);
    return {};
  }
};

export const updateTask = async (task: TaskData) => {
  const res = await fetch(`/api/tasks/${task.id}`, {
    method: HttpMethod.PUT,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (res.ok) {
    return await res.json();
  } else {
    console.error(res);
    return {};
  }
};

export const removeTask = async (task: TaskData) => {
  const res = await fetch(`/api/tasks/${task.id}/removed`, {
    method: HttpMethod.PATCH,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(task),
  });
  if (!res.ok) console.error(res);
  return res.status;
};
