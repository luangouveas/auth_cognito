import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import cognito from "@/domain/cognito";

export async function respondToSoftwareTokenMfaChallengeRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/respond_to_software_token_mfa_challenge', {
        schema: {
            body: z.object({
                session: z.string(),
                code: z.string(),
                email: z.string(),
            })
        }
    }, async (request, reply) => {
        const { session, code, email } = request.body

        try {
            const result = await cognito.respond_to_software_token_mfa_challenge({ session, code, email })

            return reply.status(200).send({
                ok: true,
                data: result,
            })   
        } catch (error) {
            let message = 'Erro ao realizar a confirmação do código de acesso.'

            if (error instanceof Error) message = error.message
            
            return reply.status(400).send({
                ok: false,
                message
            })
        }
    })
}