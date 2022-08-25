import { Category } from '../domain/Category';
import { CategoryColor, Color } from '../domain/CategoryColor';
import { CategoryName } from '../domain/CategoryName';
import { CategoryRepository } from '../infrastructure/CategoryRepository';

export class CreateCategoryUseCase {
  categoryRepository: CategoryRepository = new CategoryRepository();

  async execute(
    name: string,
    color: Color | null,
    userId: string
  ): Promise<CreateCategoryDtoType> {
    const categoryName = new CategoryName(name);
    const categoryColor = new CategoryColor(color);
    const category = Category.create(categoryName, categoryColor, userId);

    try {
      this.categoryRepository.create(category);
    } catch (error) {
      console.error(error);
      throw error;
    }

    return new CreateCategoryDto(category);
  }
}

export interface CreateCategoryDtoType {
  id: string;
  name: string;
  color: string;
  userId: string;
}

class CreateCategoryDto implements CreateCategoryDtoType {
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
