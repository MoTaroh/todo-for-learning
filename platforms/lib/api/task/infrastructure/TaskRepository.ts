import prisma from "@/lib/prisma";
import { Task as TaskType } from "@prisma/client";
import { Task } from "../domain/Task";
import cuid from "cuid";

export class TaskRepository {
  save(task: Task): Promise<TaskType> {
    return prisma.task.create({
      data: task,
    });
  }

  generateId(): string {
    return cuid();
  }
}
