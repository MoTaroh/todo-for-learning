import { Category } from '../domain/Category';
import { ObjectId } from '../domain/ObjectId';
import { CategoryRepository } from '../infrastructure/CategoryRepository';

export class FindCategoryUseCase {
  categoryRepository: CategoryRepository = new CategoryRepository();

  async findCategoryById(
    categoryId: string
  ): Promise<FindCategoryDtoType | null> {
    const category = await this.categoryRepository.findById(
      new ObjectId(categoryId)
    );

    return category ? new FindCategoryDto(category) : null;
  }

  async findAllCategories(userId: string): Promise<FindCategoryDtoType[]> {
    const categories = await this.categoryRepository.findAll(userId);

    return categories.map((category) => new FindCategoryDto(category));
  }
}

export interface FindCategoryDtoType {
  id: string;
  name: string;
  color: string;
  userId: string;
}

class FindCategoryDto implements FindCategoryDtoType {
  id: string;
  name: string;
  color: string;
  userId: string;

  constructor(category: Category) {
    this.id = category.id.value;
    this.name = category.name.value;
    this.color = category.color.value;
    this.userId = category.userId;
  }
}
