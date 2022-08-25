import { DeleteCategoryController } from '@/lib/api/task/presentation/DeleteCategoryController';
import { FindCategoryController } from '@/lib/api/task/presentation/FindCategoryController';
import { UpdateCategoryController } from '@/lib/api/task/presentation/UpdateCategoryController';
import { HttpMethod } from '@/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET: {
      const findCategoryController = new FindCategoryController();
      return findCategoryController.findCategory(req, res);
    }
    case HttpMethod.PUT: {
      const updateCategoryController = new UpdateCategoryController();
      return updateCategoryController.updateCategory(req, res);
    }
    case HttpMethod.DELETE: {
      const deleteCategoryController = new DeleteCategoryController();
      return deleteCategoryController.deleteCategory(req, res);
    }
  }
}
