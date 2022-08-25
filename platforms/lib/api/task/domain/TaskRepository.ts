import { Task } from './Task';
import { ObjectId } from './ObjectId';

export interface ITaskRepository {
  findAll: (userId: string) => Promise<Task[]>;
  findById: (taskId: ObjectId) => Promise<Task | null>;
  create: (task: Task) => Promise<Task>;
  update: (task: Task) => Promise<Task>;
}
