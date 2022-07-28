import { Task } from '../domain/Task';
import { TaskId } from '../domain/TaskId';
import { TaskRepository } from '../infrastructure/TaskRepository';

export class FindTaskUseCase {
  taskRepository: TaskRepository = new TaskRepository();

  async findTaskById(taskId: string): Promise<FindTaskDtoType | null> {
    const task = await this.taskRepository.findById(new TaskId(taskId));

    return task ? new FindTaskDto(task) : null;
  }

  async findAllTasks(userId: string): Promise<FindTaskDtoType[]> {
    const tasks = await this.taskRepository.findAll(userId);

    return tasks.map((task) => new FindTaskDto(task));
  }
}

export interface FindTaskDtoType {
  id: string;
  name: string;
  done: boolean;
  removed: boolean;
  userId: string;
}
class FindTaskDto implements FindTaskDtoType {
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
