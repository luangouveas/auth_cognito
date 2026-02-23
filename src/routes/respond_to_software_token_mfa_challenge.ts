import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import cognito from "@/domain/cognito";

export async function respondToSoftwareTokenMfaChallengeRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/respond_to_software_token_mfa_challenge', {
        schema: {
            body: z.object({
                session: z.string(),
                code: z.string(),
                username: z.string(),
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
        const { session, code, username } = request.body
    
        const result = await cognito.respond_to_software_token_mfa_challenge({ session, code, username })

        return reply.status(200).send({
            ok: true,
            data: {
                session: result.Session
            }
        })   

    })
}