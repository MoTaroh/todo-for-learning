import { Category } from '../domain/Category';
import { Task } from '../domain/Task';

export interface TaskDtoType {
  id: string;
  name: string;
  description: string | null;
  done: boolean;
  removed: boolean;
  categoryId: string | null;
  userId: string;
}

export class TaskDto implements TaskDtoType {
  id: string;
  name: string;
  description: string | null;
  done: boolean;
  removed: boolean;
  categoryId: string | null;
  userId: string;
  category: object | null;

  constructor(task: Task, category: Category | null) {
    this.id = task.id.value;
    this.name = task.name.value;
    this.description = task.description.value;
    this.done = task.done;
    this.removed = task.removed;
    this.categoryId = task.categoryId?.value || null;
    this.userId = task.userId;
    this.category = category
      ? (this.category = {
          id: category.id.value,
          name: category.name.value,
          color: category.color.value,
        })
      : null;
  }
}
