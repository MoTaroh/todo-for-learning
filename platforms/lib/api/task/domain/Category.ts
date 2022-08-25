import { CategoryColor } from './CategoryColor';
import { ObjectId } from './ObjectId';
import { CategoryName } from './CategoryName';

interface CategoryType {
  id: ObjectId;
  name: CategoryName;
  color: CategoryColor;
  userId: string;
}

export class Category implements CategoryType {
  id: ObjectId;
  name: CategoryName;
  color: CategoryColor;
  userId: string;

  private constructor(
    id: ObjectId,
    name: CategoryName,
    color: CategoryColor,
    userId: string
  ) {
    this.id = id;
    this.name = name;
    this.color = color;
    this.userId = userId;
  }

  static create(name: CategoryName, color: CategoryColor, userId: string) {
    const id = new ObjectId();
    const categoryName = name;
    const categoryColor = color;
    const uId = userId;

    return new Category(id, categoryName, categoryColor, uId);
  }

  static reconstruct(categoryRecord: CategoryType): Category {
    return new Category(
      categoryRecord.id,
      categoryRecord.name,
      categoryRecord.color,
      categoryRecord.userId
    );
  }
}
