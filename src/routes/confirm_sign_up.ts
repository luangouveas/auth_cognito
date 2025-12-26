import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import cognito from "@/domain/cognito";

export async function confirmSignUpRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/confirm_sign_up', {
        schema: {
            body: z.object({
                username: z.string(),
                code: z.string()
            })
        }
    }, async (request, reply) => {
        const { username, code } = request.body

        try {
            const result = await cognito.confirm_sign_up(username, code)

            return reply.status(200).send({
                ok: true,
                data: result,
            })   
        } catch (error) {
            let message = 'Erro ao confirmar o código.'

            if (error instanceof Error) message = error.message
            
            return reply.status(400).send({
                ok: false,
                message
            })
        }
    })
}