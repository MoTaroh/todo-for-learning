import { CreateTaskController } from '@/lib/api/task/presentation/CreateTaskController';
import { FindTaskController } from '@/lib/api/task/presentation/FindTaskController';
import { HttpMethod } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET: {
      const findTaskController = new FindTaskController();
      return findTaskController.findAllTasks(req, res, session);
    }
    case HttpMethod.POST: {
      const createTaskController = new CreateTaskController();
      return createTaskController.createTask(req, res, session);
    }
    default:
      res.setHeader('Allow', [HttpMethod.GET, HttpMethod.POST]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
