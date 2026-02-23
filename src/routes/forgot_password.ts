import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import cognito from "@/domain/cognito";

export async function forgotPasswordRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/forgot_password', {
        schema: {
            body: z.object({
                username: z.string(),
            }),
            response: {
                200: z.object({
                    ok: z.literal(true),
                    message: z.string()
                })
            }
        }
    }, async (request, reply) => {
        const { username } = request.body

        await cognito.forgot_password(username)

        return reply.status(200).send({
            ok: true,
            message: 'Solicitação de recuperação de senha enviada com sucesso.',
        })   
    })
}