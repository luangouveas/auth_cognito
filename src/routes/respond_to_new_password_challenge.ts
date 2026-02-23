import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import cognito from "@/domain/cognito";

export async function respondToNewPasswordChallengeRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/respond_to_new_password_challenge', {
        schema: {
            body: z.object({
                username: z.string(),
                password: z.string(),
                session: z.string(),
            }),
            response: {
                200: z.object({
                    ok: z.literal(true),
                    data: z.object({
                        session: z.string().optional(),
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { username, password, session } = request.body

        const result = await cognito.respond_new_password_challenge({ username, password, session })

        return reply.status(200).send({
            ok: true,
            data: {
                session: result.Session
            },
        }) 

    })
}