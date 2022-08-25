import { CategoryColor } from '../domain/CategoryColor';
import { CategoryName } from '../domain/CategoryName';
import { ObjectId } from '../domain/ObjectId';
import { CategoryRepository } from '../infrastructure/CategoryRepository';

interface Detail {
  name: string;
  color: string | null;
}
export class UpdateCategoryUseCase {
  categoryRepository: CategoryRepository = new CategoryRepository();

  async execute(categoryId: string, detail: Detail): Promise<void> {
    const id = new ObjectId(categoryId);
    const category = await this.categoryRepository.findById(id);
    if (!category) {
      throw new Error(`Category ${id} not found`);
    }

    const name = new CategoryName(detail.name);
    const color = new CategoryColor(detail.color);
    category.changeName(name);
    category.changeColor(color);

    this.categoryRepository.update(category);
  }
}
