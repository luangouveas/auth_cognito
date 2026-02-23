import cognito from "@/domain/cognito";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

export async function resendTemporaryPasswordRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/resend_temporary_password', {
        schema: {
            body: z.object({
                username: z.string(),
            }),
            response: {
                200: z.object({
                    ok: z.literal(true),
                    message: z.string()
                })
            }
        }
    }, async (request, reply) => {
        const { username } = request.body
     
        await cognito.admin_create_user(username, true)

        return reply.status(200).send({
            ok: true,
            message: 'Senha temporária reenviada com sucesso.',
        })   

    })
}