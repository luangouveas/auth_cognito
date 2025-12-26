import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import cognito from "@/domain/cognito";

export async function resendConfirmationCodeRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/resend_confirmation_code', {
        schema: {
            body: z.object({
                email: z.string(),
            })
        }
    }, async (request, reply) => {
        const { email } = request.body

        try {
            const result = await cognito.resend_confirmation_code(email)

            return reply.status(200).send({
                ok: true,
                data: result,
            })   
        } catch (error) {
            let message = 'Erro ao reenviar o código.'

            if (error instanceof Error) message = error.message
            
            return reply.status(400).send({
                ok: false,
                message
            })
        }
    })
}