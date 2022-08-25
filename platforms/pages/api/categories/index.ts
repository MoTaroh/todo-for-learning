import { CreateCategoryController } from '@/lib/api/task/presentation/CreateCategoryController';
import { FindCategoryController } from '@/lib/api/task/presentation/FindCategoryController';
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
      const findCategoryController = new FindCategoryController();
      return findCategoryController.findAllCategories(req, res, session);
    }
    case HttpMethod.POST: {
      const createCategoryController = new CreateCategoryController();
      return createCategoryController.createCategory(req, res, session);
    }
    default:
      res.setHeader('Allow', [HttpMethod.GET, HttpMethod.POST]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
