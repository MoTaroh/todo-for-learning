import { FindTaskController } from '@/lib/api/task/presentation/FindTaskController'
import { HttpMethod } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from '../../auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) return res.status(401).end()

  switch (req.method) {
    case HttpMethod.GET: {
      const findTaskController = new FindTaskController()
      return findTaskController.findTask(req, res)
    }
  }
}
