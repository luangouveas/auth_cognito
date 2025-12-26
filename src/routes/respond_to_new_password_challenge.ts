import { z } from "zod";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import cognito from "@/domain/cognito";

export async function respondToNewPasswordChallengeRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/respond_to_new_password_challenge', {
        schema: {
            body: z.object({
                email: z.string(),
                password: z.string(),
                session: z.string(),
            })
        }
    }, async (request, reply) => {
        const { email, password, session } = request.body

        try {
            const result = await cognito.respond_new_password_challenge({ email, password, session })

            return reply.status(200).send({
                ok: true,
                data: result,
            })   
        } catch (error) {
            let message = 'Erro ao definir nova senha para o usuário.'

            if (error instanceof Error) message = error.message
            
            return reply.status(400).send({
                ok: false,
                message
            })
        }
    })
}