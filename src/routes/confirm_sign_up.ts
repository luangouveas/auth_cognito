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
            }),
            response: {
                200: z.object({
                    ok: z.literal(true),
                    message: z.string()
                })
            }
        }
    }, async (request, reply) => {
        const { username, code } = request.body
     
        await cognito.confirm_sign_up(username, code)

        return reply.status(200).send({
            ok: true,
            message: 'Usuário comfirmado com sucesso.',
        })   
    })
}