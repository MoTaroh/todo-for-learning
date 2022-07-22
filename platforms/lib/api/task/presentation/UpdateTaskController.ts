import { NextApiRequest, NextApiResponse } from "next";
import { UpdateTaskDoneStatusUseCase } from "../usecase/UpdateTaskDoneStatusUseCase";
import { UpdateTaskRemovedStatusUseCase } from "../usecase/updateTaskRemovedStatusUseCase";

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

  async updateRemovedStatus(req: NextApiRequest, res: NextApiResponse) {
    const usecase = new UpdateTaskRemovedStatusUseCase();
    const { taskId } = req.query;
    const { removed } = req.body;

    if (Array.isArray(taskId) || !taskId)
      return res.status(400).end("Bad request. taskId parameter is invalid.");

    switch (removed) {
      case true:
        try {
          await usecase.removeTask(taskId);
          return res.status(204).end();
        } catch (error) {
          console.error(error);
          return res.status(500).end(error);
        }
      case false:
        try {
          await usecase.restoreTask(taskId);
          return res.status(204).end();
        } catch (error) {
          console.error(error);
          return res.status(500).end(error);
        }
      default:
        return res.status(500).end("Invalid request");
    }
  }
}
