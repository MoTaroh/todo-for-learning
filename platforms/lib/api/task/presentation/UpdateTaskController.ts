import { Task } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { UpdateTaskUseCase } from "../usecase/UpdateTaskUseCase";

export class UpdateTaskController {
  async updateTask(
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void | NextApiResponse<Task>> {
    const usecase = new UpdateTaskUseCase();
    const task = req.body;

    try {
      const updatedTask = await usecase.updateTask(task);

      return res.status(201).json(updatedTask);
    } catch (error) {
      console.error(error);
      return res.status(500).end(error);
    }
  }
}
