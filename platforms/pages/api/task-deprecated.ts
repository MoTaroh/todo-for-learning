import { getTask, updateTask } from "@/lib/api/task-deprecated";
import { CreateTaskController } from "@/lib/api/task/presentation/CreateTaskController";
import { HttpMethod } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function task(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession({ req, res }, authOptions);
  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      return getTask(req, res, session);
    case HttpMethod.POST:
      const controller = new CreateTaskController();
      return controller.createTask(req, res);
    case HttpMethod.PUT:
      return updateTask(req, res);
    default:
      res.setHeader("Allow", [HttpMethod.GET, HttpMethod.POST, HttpMethod.PUT]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
