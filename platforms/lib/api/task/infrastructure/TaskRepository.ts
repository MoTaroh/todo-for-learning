import prisma from '@/lib/prisma'
import { Task as TaskDBType } from '@prisma/client'
import { Task } from '../domain/Task'
import { TaskId } from '../domain/TaskId'
import { TaskName } from '../domain/TaskName'
import { ITaskRepository } from '../domain/TaskRepository'

export class TaskRepository implements ITaskRepository {
  async findAll(userId: string): Promise<Task[]> {
    const taskRecords = await prisma.task.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return taskRecords.map((r) => mapRecordToEntity(r))
  }

  async findById(taskId: TaskId): Promise<Task | null> {
    const taskRecord = await prisma.task.findUnique({
      where: {
        id: taskId.value,
      },
    })

    return taskRecord ? mapRecordToEntity(taskRecord) : null
  }

  async create(task: Task): Promise<Task> {
    const { id, name, ...partial } = task
    const taskRecord = await prisma.task.create({
      data: { id: id.value, name: name.value, ...partial },
    })

    return mapRecordToEntity(taskRecord)
  }

  async update(task: Task): Promise<Task> {
    const { id, name, ...partial } = task
    const taskRecord = await prisma.task.update({
      data: { id: id.value, name: name.value, ...partial },
      where: { id: id.value },
    })

    return mapRecordToEntity(taskRecord)
  }
}

/**
 * DBのレコードからTaskエンティティを再構成する
 * @param taskRecord
 * @returns
 */
function mapRecordToEntity(taskRecord: TaskDBType): Task {
  const { id, name, done, removed, userId } = taskRecord
  const record = {
    id: new TaskId(id),
    name: new TaskName(name),
    done: done,
    removed: removed,
    userId: userId,
  }

  return Task.reconstruct(record)
}
