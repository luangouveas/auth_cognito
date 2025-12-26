import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import cognito from "@/domain/cognito";

export async function adminResetUserPasswordRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/admin_reset_user_password', {
        schema: {
            body: z.object({
                username: z.string(),
            }),
            response: {
                204: z.object({
                    ok: z.literal(true),
                    message: z.string()
                })
            }
        }
    }, async (request, reply) => {
        const { username } = request.body
  
        await cognito.admin_reset_user_password(username)

        return reply.status(204).send({
            ok: true,
            message: 'Senha do usuário resetada com sucesso.'
        })   

    })
}