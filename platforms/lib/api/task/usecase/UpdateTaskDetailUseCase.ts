import { TaskId } from '../domain/TaskId';
import { TaskName } from '../domain/TaskName';
import { TaskRepository } from '../infrastructure/TaskRepository';

interface Detail {
  name: string;
}
export class UpdateTaskDetailUseCase {
  taskRepository: TaskRepository = new TaskRepository();

  async execute(taskId: string, detail: Detail): Promise<void> {
    const id = new TaskId(taskId);
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error(`Task ${id} not found`);
    }
    if ('name' in detail) {
      const name = new TaskName(detail.name);
      task.changeName(name);
    }

    this.taskRepository.update(task);
  }
}
