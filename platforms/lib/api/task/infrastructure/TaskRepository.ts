import prisma from '@/lib/prisma';
import { Task as TaskDBType } from '@prisma/client';
import { ObjectId } from '../domain/ObjectId';
import { Task } from '../domain/Task';
import { TaskDescription } from '../domain/TaskDescription';
import { TaskName } from '../domain/TaskName';
import { ITaskRepository } from '../domain/TaskRepository';

export class TaskRepository implements ITaskRepository {
  async findAll(userId: string): Promise<Task[]> {
    const taskRecords = await prisma.task.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return taskRecords.map((r) => mapRecordToEntity(r));
  }

  async findById(taskId: ObjectId): Promise<Task | null> {
    const taskRecord = await prisma.task.findUnique({
      where: {
        id: taskId.value,
      },
    });

    return taskRecord ? mapRecordToEntity(taskRecord) : null;
  }

  async create(task: Task): Promise<Task> {
    const { id, name, description, categoryId, ...partial } = task;
    const taskRecord = await prisma.task.create({
      data: {
        id: id.value,
        name: name.value,
        description: description.value,
        categoryId: categoryId?.value || null,
        ...partial,
      },
    });

    return mapRecordToEntity(taskRecord);
  }

  async update(task: Task): Promise<Task> {
    const { id, name, description, categoryId, ...partial } = task;
    const taskRecord = await prisma.task.update({
      data: {
        id: id.value,
        name: name.value,
        description: description.value,
        categoryId: categoryId?.value || null,
        ...partial,
      },
      where: { id: id.value },
    });

    return mapRecordToEntity(taskRecord);
  }
}

/**
 * DBのレコードからTaskエンティティを再構成する
 * @param taskRecord
 * @returns
 */
function mapRecordToEntity(taskRecord: TaskDBType): Task {
  const { id, name, description, done, removed, categoryId, userId } =
    taskRecord;
  const record = {
    id: new ObjectId(id),
    name: new TaskName(name),
    description: new TaskDescription(description),
    done: done,
    removed: removed,
    categoryId: categoryId ? new ObjectId(categoryId) : null,
    userId: userId,
  };

  return Task.reconstruct(record);
}
