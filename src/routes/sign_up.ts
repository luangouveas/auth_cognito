import cognito from "@/domain/cognito";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function signUpRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/sign_up', {
        schema: {
            body: z.object({
                username: z.string(),
            }),
            response: {
                201: z.object({
                    ok: z.literal(true),
                    message: z.string()
                })
            }
        }
    }, async (request, reply) => {
        const { username } = request.body
     
        await cognito.admin_create_user(username)

        return reply.status(201).send({
            ok: true,
            message: 'Usuário cadastrado com sucesso.',
        })   

    })
}