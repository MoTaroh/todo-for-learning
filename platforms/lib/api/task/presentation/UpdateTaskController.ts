import { NextApiRequest, NextApiResponse } from 'next';
import { UpdateTaskCategoryUseCase } from '../usecase/UpdateTaskCategoryUseCase';
import { UpdateTaskDetailUseCase } from '../usecase/UpdateTaskDetailUseCase';
import { UpdateTaskDoneStatusUseCase } from '../usecase/UpdateTaskDoneStatusUseCase';
import { UpdateTaskRemovedStatusUseCase } from '../usecase/UpdateTaskRemovedStatusUseCase';

export class UpdateTaskController {
  async updateTask(req: NextApiRequest, res: NextApiResponse) {
    const usecase = new UpdateTaskDetailUseCase();
    const { taskId } = req.query;
    const { name, description, categoryId } = req.body;

    if (Array.isArray(taskId) || !taskId)
      return res.status(400).end('Bad request. taskId parameter is invalid.');

    const detail = {
      name: name,
      description: description,
      categoryId: categoryId,
    };
    try {
      const updatedTask = await usecase.execute(taskId, detail);
      return res.status(200).json(updatedTask);
    } catch (error) {
      console.error(error);
      return res.status(500).end();
    }
  }
  async updateDoneStatus(req: NextApiRequest, res: NextApiResponse) {
    const usecase = new UpdateTaskDoneStatusUseCase();
    const { taskId } = req.query;
    const { done } = req.body;

    if (Array.isArray(taskId) || !taskId)
      return res.status(400).end('Bad request. taskId parameter is invalid.');

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
        return res.status(500).end('Invalid request');
    }
  }

  async updateRemovedStatus(req: NextApiRequest, res: NextApiResponse) {
    const usecase = new UpdateTaskRemovedStatusUseCase();
    const { taskId } = req.query;
    const { removed } = req.body;

    if (Array.isArray(taskId) || !taskId)
      return res.status(400).end('Bad request. taskId parameter is invalid.');

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
        return res.status(500).end('Invalid request');
    }
  }

  async updateCategory(req: NextApiRequest, res: NextApiResponse) {
    const usecase = new UpdateTaskCategoryUseCase();
    const { taskId } = req.query;
    const { categoryId } = req.body;

    if (Array.isArray(taskId) || !taskId)
      return res.status(400).end('Bad request. taskId parameter is invalid.');

    if (categoryId) {
      try {
        await usecase.assignCategory(taskId, categoryId);
        return res.status(204).end();
      } catch (error) {
        console.error(error);
        return res.status(500).end(error);
      }
    } else {
      try {
        await usecase.unassignCategory(taskId);
        return res.status(204).end();
      } catch (error) {
        console.error(error);
        return res.status(500).end(error);
      }
    }
  }
}
