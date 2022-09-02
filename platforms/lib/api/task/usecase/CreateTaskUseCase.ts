import { Task } from '../domain/Task';
import { TaskRepository } from '../infrastructure/TaskRepository';
import { TaskName } from '../domain/TaskName';
import { TaskDescription } from '../domain/TaskDescription';
import { ObjectId } from '../domain/ObjectId';
import { Category } from '../domain/Category';
import { CategoryRepository } from '../infrastructure/CategoryRepository';

export class CreateTaskUseCase {
  taskRepository: TaskRepository = new TaskRepository();
  categoryRepository: CategoryRepository = new CategoryRepository();

  async execute(
    name: string,
    description: string | null,
    category: string | null,
    userId: string
  ): Promise<CreateTaskDtoType> {
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

    return new CreateTaskDto(task, existingCategory);
  }
}

export interface CreateTaskDtoType {
  id: string;
  name: string;
  description: string | null;
  done: boolean;
  removed: boolean;
  categoryId: string | null;
  userId: string;
}

class CreateTaskDto implements CreateTaskDtoType {
  id: string;
  name: string;
  description: string | null;
  done: boolean;
  removed: boolean;
  categoryId: string | null;
  userId: string;
  category: object | null;

  constructor(task: Task, category: Category | null) {
    this.id = task.id.value;
    this.name = task.name.value;
    this.description = task.description.value;
    this.done = task.done;
    this.removed = task.removed;
    this.categoryId = task.categoryId?.value || null;
    this.userId = task.userId;
    this.category = category
      ? (this.category = {
          id: category.id.value,
          name: category.name.value,
          color: category.color.value,
        })
      : null;
  }
}
