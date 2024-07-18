import { inferAsyncReturnType } from "@trpc/server"
import { getAuth } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"
import { db } from "@/infrastructure/database"

/**
 * Creates a TRPC context with user and database information.
 *
 * @param opts - The options for creating the TRPC context.
 * @param opts.req - The NextRequest object.
 * @returns The TRPC context object.
 */
export const createTRPCContext = async (opts: { req: NextRequest }) => {
  const { req } = opts
  const sesh = await getAuth(req)
  const user = sesh.userId
    ? await db.user.findUnique({ where: { id: sesh.userId } })
    : null

  return {
    user,
    db,
  }
}

export type TRPCContext = inferAsyncReturnType<typeof createTRPCContext>
