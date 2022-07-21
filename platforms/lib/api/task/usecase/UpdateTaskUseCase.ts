import { Task as TaskType } from "@prisma/client";
import { Task } from "../domain/Task";
import { TaskRepository } from "../infrastructure/TaskRepository";

export class UpdateTaskUseCase {
  taskRepository: TaskRepository = new TaskRepository();

  async updateTask(task: Task): Promise<TaskType> {
    const found = this.taskRepository.findById(task.id);
    if (!found) {
      throw new Error(`Task ${task.id} not found`);
    }

    return await this.taskRepository.update(task);
  }
}
