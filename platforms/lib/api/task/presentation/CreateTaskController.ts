import { Task } from '@prisma/client'
import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'
import { CreateTaskUseCase } from '../usecase/CreateTaskUseCase'

export class CreateTaskController {
  async createTask(
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session
  ): Promise<void | NextApiResponse<Task>> {
    if (!session.user.id)
      return res.status(500).end('Server failed to get session user ID')
    const { name } = req.body
    const usecase = new CreateTaskUseCase()

    try {
      const newTask = await usecase.execute(name, session.user.id)

      return res.status(201).json(newTask)
    } catch (error) {
      console.error(error)
      return res.status(500).end(error)
    }
  }
}
