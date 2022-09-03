import { Task } from '../domain/Task';
import { TaskRepository } from '../infrastructure/TaskRepository';
import { TaskName } from '../domain/TaskName';
import { TaskDescription } from '../domain/TaskDescription';
import { ObjectId } from '../domain/ObjectId';
import { CategoryRepository } from '../infrastructure/CategoryRepository';
import { TaskDto, TaskDtoType } from './TaskDto';

export class CreateTaskUseCase {
  taskRepository: TaskRepository = new TaskRepository();
  categoryRepository: CategoryRepository = new CategoryRepository();

  async execute(
    name: string,
    description: string | null,
    category: string | null,
    userId: string
  ): Promise<TaskDtoType> {
    const taskName = new TaskName(name);
    const taskDescription = new TaskDescription(description);
    const categoryId = category ? new ObjectId(category) : null;
    const task = Task.create(taskName, taskDescription, categoryId, userId);
    let existingCategory = null;
    try {
      if (categoryId) {
        existingCategory = await this.categoryRepository.findById(categoryId);
        if (!existingCategory)
          throw new Error(`Category ${category} not found`);
      }
      this.taskRepository.create(task);
    } catch (error) {
      console.error(error);
      throw error;
    }

    return new TaskDto(task, existingCategory);
  }
}
