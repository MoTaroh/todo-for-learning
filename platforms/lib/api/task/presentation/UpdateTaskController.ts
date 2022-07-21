import { Task } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { UpdateTaskDoneStatusUseCase } from "../usecase/UpdateTaskDoneStatusUseCase";
import { UpdateTaskUseCase } from "../usecase/UpdateTaskUseCase";

export class UpdateTaskController {
  async updateDoneStatus(req: NextApiRequest, res: NextApiResponse) {
    const usecase = new UpdateTaskDoneStatusUseCase();
    const { taskId } = req.query;
    const { done } = req.body;

    if (Array.isArray(taskId) || !taskId)
      return res.status(400).end("Bad request. taskId parameter is invalid.");

    switch (done) {
      case true:
        try {
          await usecase.doneTask(taskId);
          return res.status(204).end();
        } catch (error) {
          console.error(error);
          return res.status(500).end(error);
        }
      case false:
        try {
          await usecase.undoneTask(taskId);
          return res.status(204).end();
        } catch (error) {
          console.error(error);
          return res.status(500).end(error);
        }
      default:
        return res.status(500).end("Invalid request");
    }
  }

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
