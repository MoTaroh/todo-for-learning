import { Task } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { CreateTaskUseCase } from "../usecase/CreateTaskUseCase";

export class CreateTaskController {
  async createTask(
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void | NextApiResponse<Task>> {
    const { name, siteId } = req.body;
    const usecase = new CreateTaskUseCase();

    try {
      const task = await usecase.createTask(name, siteId);

      return res.status(201).json(task);
    } catch (error) {
      console.error(error);
      return res.status(500).end(error);
    }
  }
}
