import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import cognito from "@/domain/cognito";

export async function signInRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/sign_in', {
        schema: {
            body: z.object({
                username: z.string(),
                password: z.string()
            }),
            response: {
                200: z.object({
                    ok: z.literal(true),
                    data: z.object({
                        session: z.string().optional(),
                        challengeName: z.string().optional(),
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { username, password } = request.body

        const result = await cognito.admin_initiate_auth(username, password)

        return reply.status(200).send({
            ok: true,
            data: {
                session: result.Session,
                challengeName: result.ChallengeName
            },
        })   
    })
}