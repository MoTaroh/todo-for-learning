import prisma from "@/lib/prisma";
import { Task as TaskType } from "@prisma/client";
import { Task } from "../domain/Task";
import cuid from "cuid";

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

  findById(taskId: string) {
    return prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
  }

  save(task: Task): Promise<TaskType> {
    return prisma.task.create({
      data: task,
    });
  }

  generateId(): string {
    return cuid();
  }
}
