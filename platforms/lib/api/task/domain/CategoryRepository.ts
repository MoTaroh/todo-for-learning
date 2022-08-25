import { Category } from './Category';
import { ObjectId } from './ObjectId';

export interface ICategoryRepository {
  findAll: (userId: string) => Promise<Category[]>;
  findById: (categoryId: ObjectId) => Promise<Category | null>;
  create: (category: Category) => Promise<Category>;
  update: (category: Category) => Promise<Category>;
  delete: (categoryId: ObjectId) => Promise<void>;
}
