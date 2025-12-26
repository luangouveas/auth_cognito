import cognito from "@/domain/cognito";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function signUpRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/sign_up', {
        schema: {
            body: z.object({
                username: z.string(),
            })
        }
    }, async (request, reply) => {
        const { username } = request.body

        try {
            const result = await cognito.admin_create_user(username)

            return reply.status(201).send({
                ok: true,
                data: result,
            })   
        } catch (error) {
            let message = 'Não foi possivel realizar a inclusão do usuário.'

            if (error instanceof Error) message = error.message
            
            return reply.status(400).send({
                ok: false,
                message
            })
        }
    })
}