import { TaskId } from '../domain/TaskId';
import { TaskRepository } from '../infrastructure/TaskRepository';

export class UpdateTaskRemovedStatusUseCase {
  taskRepository: TaskRepository = new TaskRepository();

  async removeTask(taskId: string): Promise<void> {
    const id = new TaskId(taskId);
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error(`Task ${id} not found`);
    }

    task.remove();
    this.taskRepository.update(task);
  }

  async restoreTask(taskId: string): Promise<void> {
    const id = new TaskId(taskId);
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error(`Task ${id} not found`);
    }

    task.restore();
    this.taskRepository.update(task);
  }
}
