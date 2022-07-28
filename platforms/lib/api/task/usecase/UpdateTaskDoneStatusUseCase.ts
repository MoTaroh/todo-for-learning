import { TaskId } from '../domain/TaskId';
import { TaskRepository } from '../infrastructure/TaskRepository';

export class UpdateTaskDoneStatusUseCase {
  taskRepository: TaskRepository = new TaskRepository();

  async doneTask(taskId: string): Promise<void> {
    const id = new TaskId(taskId);
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error(`Task ${id} not found`);
    }

    task.doneTask();
    this.taskRepository.update(task);
  }

  async undoneTask(taskId: string): Promise<void> {
    const id = new TaskId(taskId);
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error(`Task ${id} not found`);
    }

    task.undoneTask();
    this.taskRepository.update(task);
  }
}
