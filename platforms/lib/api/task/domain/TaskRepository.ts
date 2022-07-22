import { Task } from "./Task";
import { TaskId } from "./TaskId";

export interface ITaskRepository {
  findAll: (userId: string) => Promise<Task[]>;
  findById: (taskId: TaskId) => Promise<Task | null>;
  create: (task: Task) => Promise<Task>;
  update: (task: Task) => Promise<Task>;
}
