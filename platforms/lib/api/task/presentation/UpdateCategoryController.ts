import { NextApiRequest, NextApiResponse } from 'next';
import { UpdateCategoryUseCase } from '../usecase/UpdateCategoryUseCase';

export class UpdateCategoryController {
  async updateCategory(req: NextApiRequest, res: NextApiResponse) {
    const usecase = new UpdateCategoryUseCase();
    const { categoryId } = req.query;
    const { name, color } = req.body;

    if (Array.isArray(categoryId) || !categoryId)
      return res
        .status(400)
        .end('Bad request. categoryId parameter is invalid.');

    const detail = {
      name: name,
      color: color,
    };
    try {
      await usecase.execute(categoryId, detail);
      return res.status(204).end();
    } catch (error) {
      console.error(error);
      return res.status(500).end();
    }
  }
}
