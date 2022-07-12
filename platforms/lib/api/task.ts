import { Session } from "next-auth";
import { NextApiRequest, NextApiResponse } from "next";
import type { Site, Task } from "@prisma/client";
import prisma from "@/lib/prisma";

interface AllTasks {
  tasks: Array<Task>;
  site: Site | null;
}

/**
 * Get Task
 *
 * Fetches & returns either a single or all tasks available depending on
 * whether a `taskId` query parameter is provided.
 * If not all tasks are returned in descending order.
 *
 * @param req - Next.js API Request
 * @param res - Next.js API Response
 * @param session
 * @returns
 */
export async function getTask(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
): Promise<void | NextApiResponse<AllTasks | (Task | null)>> {
  const { taskId, siteId } = req.query;

  if (Array.isArray(taskId) || Array.isArray(siteId))
    return res
      .status(400)
      .end("Bad request. taskId parameter cannot be an array.");

  if (!session.user.id)
    return res.status(500).end("Server failed to get session user ID");

  try {
    // getByID
    if (taskId) {
      const task = await prisma.task.findFirst({
        where: {
          id: taskId,
          site: {
            user: {
              id: session.user.id,
            },
          },
        },
        include: {
          site: true,
        },
      });

      return res.status(200).json(task);
    }

    // search
    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        user: {
          id: session.user.id,
        },
      },
    });

    const tasks = !site
      ? []
      : await prisma.task.findMany({
          where: {
            site: {
              id: siteId,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

    return res.status(200).json({
      tasks,
      site,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

export async function createTask(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Task>> {
  const { name, done, removed, siteId } = req.body;

  try {
    const task = await prisma.task.create({
      data: {
        name,
        done,
        removed,
        siteId,
      },
    });

    return res.status(201).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}

export async function updateTask(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void | NextApiResponse<Task>> {
  const { id, name, done, removed } = req.body;

  try {
    const task = await prisma.task.update({
      where: {
        id: id,
      },
      data: {
        name,
        done,
        removed,
      },
    });

    return res.status(200).json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).end(error);
  }
}
