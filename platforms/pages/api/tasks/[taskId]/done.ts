import { UpdateTaskController } from '@/lib/api/task/presentation/UpdateTaskController'
import { HttpMethod } from '@/types'
import { NextApiRequest, NextApiResponse } from 'next'
import { unstable_getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)
  if (!session) return res.status(401).end()

  switch (req.method) {
    case HttpMethod.PATCH: {
      const controller = new UpdateTaskController()
      return controller.updateDoneStatus(req, res)
    }
    default:
      res.setHeader('Allow', [HttpMethod.PATCH])
      return res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
