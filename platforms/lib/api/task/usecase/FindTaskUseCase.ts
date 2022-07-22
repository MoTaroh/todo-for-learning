import { TaskId } from "../domain/TaskId";
import { TaskRepository } from "../infrastructure/TaskRepository";

export class FindTaskUseCase {
  taskRepository: TaskRepository = new TaskRepository();

  async findTaskById(taskId: string) {
    return await this.taskRepository.findById(new TaskId(taskId));
  }

  async findAllTasks(userId: string) {
    return await this.taskRepository.findAll(userId);
  }
}
