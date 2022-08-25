import { Task } from '../domain/Task';
import { TaskRepository } from '../infrastructure/TaskRepository';
import { TaskName } from '../domain/TaskName';
import { TaskDescription } from '../domain/TaskDescription';
import { ObjectId } from '../domain/ObjectId';

export class CreateTaskUseCase {
  taskRepository: TaskRepository = new TaskRepository();

  async execute(
    name: string,
    description: string | null,
    category: string | null,
    userId: string
  ): Promise<CreateTaskDtoType> {
    const taskName = new TaskName(name);
    const taskDescription = new TaskDescription(description);
    const categoryId = category ? new ObjectId(category) : null;
    const task = Task.create(taskName, taskDescription, categoryId, userId);
    try {
      this.taskRepository.create(task);
    } catch (error) {
      console.error(error);
      throw error;
    }

    return new CreateTaskDto(task);
  }
}

export interface CreateTaskDtoType {
  id: string;
  name: string;
  description: string | null;
  done: boolean;
  removed: boolean;
  categoryId: string | null;
  userId: string;
}

class CreateTaskDto implements CreateTaskDtoType {
  id: string;
  name: string;
  description: string | null;
  done: boolean;
  removed: boolean;
  categoryId: string | null;
  userId: string;

  constructor(task: Task) {
    this.id = task.id.value;
    this.name = task.name.value;
    this.description = task.description.value;
    this.done = task.done;
    this.removed = task.removed;
    this.categoryId = task.categoryId?.value || null;
    this.userId = task.userId;
  }
}
