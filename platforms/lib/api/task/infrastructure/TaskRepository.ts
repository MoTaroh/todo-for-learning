import prisma from "@/lib/prisma";
import { Task as TaskType } from "@prisma/client";
import { Task } from "../domain/Task";
import { TaskId } from "../domain/TaskId";

export class TaskRepository {
  findMany(userId: string) {
    return prisma.task.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(taskId: TaskId): Promise<Task | null> {
    const taskRecord = await prisma.task.findUnique({
      where: {
        id: taskId.value,
      },
    });

    return taskRecord ? mapRecordToEntity(taskRecord) : null;
  }

  async create(task: Task): Promise<Task> {
    const { id, ...partial } = task;
    const taskRecord = await prisma.task.create({
      data: { id: id.value, ...partial },
    });

    return mapRecordToEntity(taskRecord);
  }

  async update(task: Task): Promise<Task> {
    const { id, ...partial } = task;
    const taskRecord = await prisma.task.update({
      data: { id: id.value, ...partial },
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
function mapRecordToEntity(taskRecord: TaskType): Task {
  const { id, name, done, removed, userId } = taskRecord;
  const record = {
    id: new TaskId(id),
    name: name,
    done: done,
    removed: removed,
    userId: userId,
  };

  return Task.reconstruct(record);
}
