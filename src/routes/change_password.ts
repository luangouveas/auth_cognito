import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import cognito from "@/domain/cognito";

export async function changePasswordRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/change_password', {
        schema: {
            body: z.object({
                access_token: z.string(),
                previus_password: z.string(),
                new_password: z.string(),
            })
        }
    }, async (request, reply) => {
        const { access_token, previus_password, new_password } = request.body

        try {
            const result = await cognito.change_password({ access_token, previus_password, new_password })

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