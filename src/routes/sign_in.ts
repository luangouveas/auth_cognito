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
            })
        }
    }, async (request, reply) => {
        const { username, password } = request.body

        try {
            const result = await cognito.admin_initiate_auth(username, password)

            return reply.status(200).send({
                ok: true,
                data: result,
            })   
        } catch (error) {
            let message = 'A autenticação falhou.'

            if (error instanceof Error) message = error.message
            
            return reply.status(400).send({
                ok: false,
                message
            })
        }
    })
}