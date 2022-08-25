import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { FindTaskDtoType, FindTaskUseCase } from '../usecase/FindTaskUseCase';

export class FindTaskController {
  async findAllTasks(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
  ): Promise<void | NextApiResponse<FindTaskDtoType[]>> {
    if (!session.user.id)
      return res.status(500).end('Server failed to get session user ID');
    const usecase = new FindTaskUseCase();

    try {
      const tasks = await usecase.findAllTasks(session.user.id);

      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).end(error);
    }
  }

  async findTask(
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void | NextApiResponse<void>> {
    const usecase = new FindTaskUseCase();
    const { taskId } = req.query;
    if (Array.isArray(taskId) || !taskId)
      return res.status(400).end('Bad request. taskId parameter is invalid.');

    try {
      const task = await usecase.findTaskById(taskId);
      if (!task) return res.status(404).end(`Error: Task ${taskId} not found.`);

      return res.status(200).json(task);
    } catch (error) {
      console.error(error);
      return res.status(500).end(error);
    }
  }
}
