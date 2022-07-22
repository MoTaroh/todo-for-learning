import { Task } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { FindTaskUseCase } from "../usecase/FindTaskUseCase";

export class FindTaskController {
  async findAllTasks(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
  ): Promise<void | NextApiResponse<Array<Task>>> {
    if (!session.user.id)
      return res.status(500).end("Server failed to get session user ID");
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
    // pass
  }
}
