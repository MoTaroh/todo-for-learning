import { ObjectId } from '../domain/ObjectId';
import { CategoryRepository } from '../infrastructure/CategoryRepository';

export class DeleteCategoryUseCase {
  categoryRepository: CategoryRepository = new CategoryRepository();

  async execute(categoryId: string): Promise<void> {
    await this.categoryRepository.delete(new ObjectId(categoryId));
  }
}
