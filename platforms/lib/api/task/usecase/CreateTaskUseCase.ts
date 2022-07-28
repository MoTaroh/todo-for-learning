import { Task } from '../domain/Task';
import { TaskRepository } from '../infrastructure/TaskRepository';
import { TaskName } from '../domain/TaskName';

export class CreateTaskUseCase {
  taskRepository: TaskRepository = new TaskRepository();

  async execute(name: string, userId: string): Promise<CreateTaskDtoType> {
    const taskName = new TaskName(name);
    const task = Task.create(taskName, userId);
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
  done: boolean;
  removed: boolean;
  userId: string;
}

class CreateTaskDto implements CreateTaskDtoType {
  id: string;
  name: string;
  done: boolean;
  removed: boolean;
  userId: string;

  constructor(task: Task) {
    this.id = task.id.value;
    this.name = task.name.value;
    this.done = task.done;
    this.removed = task.removed;
    this.userId = task.userId;
  }
}
