import { NextApiRequest, NextApiResponse } from 'next';
import { DeleteCategoryUseCase } from '../usecase/DeleteCategoryUseCase';

export class DeleteCategoryController {
  async deleteCategory(req: NextApiRequest, res: NextApiResponse) {
    const usecase = new DeleteCategoryUseCase();
    const { categoryId } = req.query;

    if (Array.isArray(categoryId) || !categoryId)
      return res
        .status(400)
        .end('Bad request. categoryId parameter is invalid.');

    try {
      await usecase.execute(categoryId);
      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).end();
    }
  }
}
