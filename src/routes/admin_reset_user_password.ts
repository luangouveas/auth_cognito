import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import cognito from "@/domain/cognito";

export async function adminResetUserPasswordRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/admin_reset_user_password', {
        schema: {
            body: z.object({
                email: z.string(),
            })
        }
    }, async (request, reply) => {
        const { email } = request.body

        try {
            const result = await cognito.admin_reset_user_password(email)

            return reply.status(204).send({
                ok: true,
                data: result,
            })   
        } catch (error) {
            let message = 'Erro ao atualizar a senha do usuário.'

            if (error instanceof Error) message = error.message
            
            return reply.status(400).send({
                ok: false,
                message
            })
        }
    })
}