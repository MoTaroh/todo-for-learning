import { Task } from "../domain/Task";
import { TaskRepository } from "../infrastructure/TaskRepository";
import { TaskId } from "../domain/TaskId";

export class CreateTaskUseCase {
  taskRepository: TaskRepository = new TaskRepository();

  async execute(name: string, userId: string): Promise<Task> {
    const task = Task.create(name, userId);
    try {
      this.taskRepository.create(task);
    } catch (error) {
      console.error(error);
      throw error;
    }

    return task;
  }
}
