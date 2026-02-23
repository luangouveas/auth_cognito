import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import cognito from "@/domain/cognito";

export async function resendConfirmationCodeRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/resend_confirmation_code', {
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

        await cognito.resend_confirmation_code(username)

        return reply.status(200).send({
            ok: true,
            message: 'Código reenviado com sucesso.',
        })   

    })
}