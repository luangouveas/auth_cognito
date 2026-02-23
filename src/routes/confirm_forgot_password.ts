import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import cognito from "@/domain/cognito";

export async function confirmForgotPasswordRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/confirm_forgot_password', {
        schema: {
            body: z.object({
                username: z.string(),
                code: z.string(),
                password: z.string()
            }),
            response: {
                204: z.object({
                    ok: z.literal(true),
                    message: z.string()
                })
            }
        }
    }, async (request, reply) => {
        const { username, code, password } = request.body

        const result = await cognito.confirm_forgot_password({ username, code, password })

        return reply.status(204).send({
            ok: true,
            message: 'Senha alterada com sucesso.',
        })   
    })
}