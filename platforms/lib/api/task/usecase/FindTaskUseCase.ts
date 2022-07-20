import { TaskRepository } from "../infrastructure/TaskRepository";

export class FindTaskUseCase {
  taskRepository: TaskRepository = new TaskRepository();

  async findTaskById(taskId: string) {
    return await this.taskRepository.findById(taskId);
  }

  async findAllTasks(userId: string) {
    return await this.taskRepository.findMany(userId);
  }
}
