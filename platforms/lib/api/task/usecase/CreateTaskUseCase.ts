import { Task } from "../domain/Task";
import { Task as TaskType } from "@prisma/client";
import { TaskRepository } from "../infrastructure/TaskRepository";

export class CreateTaskUseCase {
  taskRepository: TaskRepository = new TaskRepository();

  async createTask(name: string, siteId: string): Promise<TaskType> {
    const taskId = this.taskRepository.generateId();
    const task = new Task(taskId, name, siteId);

    return await this.taskRepository.save(task);
  }
}