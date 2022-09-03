import { ObjectId } from '../domain/ObjectId';
import { TaskDescription } from '../domain/TaskDescription';
import { TaskName } from '../domain/TaskName';
import { CategoryRepository } from '../infrastructure/CategoryRepository';
import { TaskRepository } from '../infrastructure/TaskRepository';
import { TaskDto, TaskDtoType } from './TaskDto';

interface Detail {
  name: string;
  description: string;
  categoryId: string;
}
export class UpdateTaskDetailUseCase {
  taskRepository: TaskRepository = new TaskRepository();
  categoryRepository: CategoryRepository = new CategoryRepository();

  async execute(taskId: string, detail: Detail): Promise<TaskDtoType> {
    const id = new ObjectId(taskId);
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error(`Task ${id} not found`);
    }
    let cId = null;
    let existingCategory = null;
    if (detail.categoryId) {
      // validate categoryId
      cId = new ObjectId(detail.categoryId);
      existingCategory = await this.categoryRepository.findById(cId);
      if (!existingCategory) {
        throw new Error(`Category ${cId.value} not found`);
      }
    }
    cId ? task.assignCategory(cId) : task.unassignCategory();
    task.changeName(new TaskName(detail.name));
    task.changeDescription(new TaskDescription(detail.description));

    this.taskRepository.update(task);
    return new TaskDto(task, existingCategory);
  }
}
