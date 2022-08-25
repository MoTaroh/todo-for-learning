import { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import {
  FindCategoryDtoType,
  FindCategoryUseCase,
} from '../usecase/FindCategoryUseCase';

export class FindCategoryController {
  async findAllCategories(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
  ): Promise<void | NextApiResponse<FindCategoryDtoType[]>> {
    if (!session.user.id)
      return res.status(500).end('Server failed to get session user ID');
    const usecase = new FindCategoryUseCase();

    try {
      const categories = await usecase.findAllCategories(session.user.id);

      return res.status(200).json(categories);
    } catch (error) {
      return res.status(500).end(error);
    }
  }

  async findCategory(
    req: NextApiRequest,
    res: NextApiResponse
  ): Promise<void | NextApiResponse<void>> {
    const usecase = new FindCategoryUseCase();
    const { categoryId } = req.query;

    if (Array.isArray(categoryId) || !categoryId)
      return res
        .status(400)
        .end('Bad request. categoryId parameter is invalid.');

    try {
      const category = await usecase.findCategoryById(categoryId);
      if (!category)
        return res.status(404).end(`Error: Category ${categoryId} not found.`);

      return res.status(200).json(category);
    } catch (error) {
      console.error(error);
      return res.status(500).end();
    }
  }
}
