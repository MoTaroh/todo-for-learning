import { ObjectId } from '../domain/ObjectId';
import { CategoryRepository } from '../infrastructure/CategoryRepository';
import { TaskRepository } from '../infrastructure/TaskRepository';

export class UpdateTaskCategoryUseCase {
  taskRepository: TaskRepository = new TaskRepository();
  categoryRepository: CategoryRepository = new CategoryRepository();

  async assignCategory(taskId: string, categoryId: string): Promise<void> {
    const tId = new ObjectId(taskId);
    const cId = new ObjectId(categoryId);

    const task = await this.taskRepository.findById(tId);
    if (!task) {
      throw new Error(`Task ${tId} not found`);
    }
    const category = await this.categoryRepository.findById(cId);
    if (!category) {
      throw new Error(`Category ${cId} not found`);
    }

    task.assignCategory(cId);
    this.taskRepository.update(task);
  }

  async unassignCategory(taskId: string): Promise<void> {
    const id = new ObjectId(taskId);
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error(`Task ${id} not found`);
    }

    task.unassignCategory();
    this.taskRepository.update(task);
  }
}
