import { Task } from "../domain/Task";
import { TaskRepository } from "../infrastructure/TaskRepository";
import { TaskId } from "../domain/TaskId";
import { TaskName } from "../domain/TaskName";

export class CreateTaskUseCase {
  taskRepository: TaskRepository = new TaskRepository();

  async execute(name: string, userId: string): Promise<Task> {
    const taskName = new TaskName(name);
    const task = Task.create(taskName, userId);
    try {
      this.taskRepository.create(task);
    } catch (error) {
      console.error(error);
      throw error;
    }

    return task;
  }
}
