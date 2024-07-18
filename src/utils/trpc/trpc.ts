import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"
import { ZodError } from "zod"
import { serverLogger } from "@/infrastructure/logger/server-logger"
import { TRPCContext } from "./trpc-context"

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : undefined,
      },
    }
  },
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

interface MyContext {
  user: any
}

/**
 * Middleware that enforces user authentication.
 *
 * @param t - The TRPC instance.
 * @returns The modified TRPC instance.
 * @throws {TRPCError} - If the user is not authenticated.
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next({
    ctx: {
      user: ctx.user,
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)

/**
 * Middleware that logs the request path and type.
 *
 * @param t - The TRPC instance.
 * @returns The modified TRPC instance.
 */
const loggerMiddleware = t.middleware(async ({ path, type, next }) => {
  const start = Date.now()
  const result = await next()
  const durationMs = Date.now() - start

  result.ok
    ? serverLogger.info(`OK request: ${type} ${path} - ${durationMs}ms`)
    : serverLogger.error(`Non-OK request: ${type} ${path} - ${durationMs}ms`)

  return result
})

export const procedureWithLogging = t.procedure.use(loggerMiddleware)

// TODO: Define routers here
const uploadRouter = createTRPCRouter({})
const userRouter = createTRPCRouter({})
const appRouter = createTRPCRouter({
  upload: uploadRouter,
  user: userRouter,
})

serverLogger.info("App router initialized")
export type AppRouter = typeof appRouter
