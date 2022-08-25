import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { Category } from '@prisma/client';
import { CreateCategoryUseCase } from '../usecase/CreateCategoryUseCase';

export class CreateCategoryController {
  async createCategory(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
  ): Promise<void | NextApiResponse<Category>> {
    if (!session.user.id)
      return res.status(500).end('Server failed to get session user ID');

    const { name, color } = req.body;
    const usecase = new CreateCategoryUseCase();

    try {
      const newCategory = await usecase.execute(name, color, session.user.id);

      return res.status(201).json(newCategory);
    } catch (error) {
      console.error(error);
      return res.status(500).end(error);
    }
  }
}
