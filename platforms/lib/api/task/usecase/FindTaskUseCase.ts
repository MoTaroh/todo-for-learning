import { Task } from '../domain/Task';
import { ObjectId } from '../domain/ObjectId';
import { TaskRepository } from '../infrastructure/TaskRepository';
import { CategoryRepository } from '../infrastructure/CategoryRepository';
import { Category } from '../domain/Category';

export class FindTaskUseCase {
  taskRepository: TaskRepository = new TaskRepository();
  categoryRepository: CategoryRepository = new CategoryRepository();

  async findTaskById(taskId: string): Promise<FindTaskDtoType | null> {
    const task = await this.taskRepository.findById(new ObjectId(taskId));
    if (!task) return null;

    let category = null;
    if (task.categoryId) {
      category = await this.categoryRepository.findById(task.categoryId);
    }

    return new FindTaskDto(task, category);
  }

  async findAllTasks(userId: string): Promise<FindTaskDtoType[]> {
    const tasks = await this.taskRepository.findAll(userId);

    return await Promise.all(
      tasks.map(async (task) => {
        let category = null;
        if (task.categoryId) {
          category = await this.categoryRepository.findById(task.categoryId);
        }
        return new FindTaskDto(task, category);
      })
    );
  }
}

export interface FindTaskDtoType {
  id: string;
  name: string;
  description: string | null;
  done: boolean;
  removed: boolean;
  categoryId: string | null;
  userId: string;
  category: object | null;
}
class FindTaskDto implements FindTaskDtoType {
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
