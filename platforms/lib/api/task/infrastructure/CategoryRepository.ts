import prisma from '@/lib/prisma';
import { Category as CategoryDBType } from '@prisma/client';
import { Category } from '../domain/Category';
import { CategoryColor } from '../domain/CategoryColor';
import { CategoryName } from '../domain/CategoryName';
import { ICategoryRepository } from '../domain/CategoryRepository';
import { ObjectId } from '../domain/ObjectId';

export class CategoryRepository implements ICategoryRepository {
  async findAll(userId: string): Promise<Category[]> {
    const categoryRecords = await prisma.category.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return categoryRecords.map((r) => mapRecordToEntity(r));
  }

  async findById(categoryId: ObjectId): Promise<Category | null> {
    const categoryRecord = await prisma.category.findUnique({
      where: {
        id: categoryId.value,
      },
    });

    return categoryRecord ? mapRecordToEntity(categoryRecord) : null;
  }

  async create(category: Category): Promise<Category> {
    const { id, name, color, userId } = category;
    const categoryRecord = await prisma.category.create({
      data: {
        id: id.value,
        name: name.value,
        color: color.value,
        userId: userId,
      },
    });

    return mapRecordToEntity(categoryRecord);
  }

  async update(category: Category): Promise<Category> {
    const { id, name, color, userId } = category;
    const categoryRecord = await prisma.category.update({
      data: {
        id: id.value,
        name: name.value,
        color: color.value,
        userId: userId,
      },
      where: { id: id.value },
    });

    return mapRecordToEntity(categoryRecord);
  }

  async delete(categoryId: ObjectId): Promise<void> {
    prisma.category.delete({
      where: { id: categoryId.value },
    });
  }
}

function mapRecordToEntity(categoryRecord: CategoryDBType): Category {
  const { id, name, color, userId } = categoryRecord;
  const record = {
    id: new ObjectId(id),
    name: new CategoryName(name),
    color: new CategoryColor(color),
    userId: userId,
  };

  return Category.reconstruct(record);
}
