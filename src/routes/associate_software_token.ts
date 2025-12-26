import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import cognito from "@/domain/cognito";
import qrcode from 'qrcode'
// import qrcodeTerminal from 'qrcode-terminal'

export async function associateSoftwareTokenRoute(fastify: FastifyInstance){
    fastify.withTypeProvider<ZodTypeProvider>().post('/associate_software_token', {
        schema: {
            body: z.object({
                username: z.string(),
                appName: z.string(),
                session: z.string(),
            })
        }
    }, async (request, reply) => {
        const { session, username, appName } = request.body

        try {
            const result = await cognito.associate_software_token(session)
            const secret_code = result.SecretCode;
            
            const otpauthUri = `otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(username)}?secret=${secret_code}&issuer=${encodeURIComponent(appName)}&algorithm=SHA1&digits=6&period=30`;

            const qr_code = await qrcode.toDataURL(otpauthUri, {
                margin: 3,
                scale: 4,
                errorCorrectionLevel: 'H',
            })
            
            // qrcodeTerminal.generate(otpauthUri, { small: true }, (qrcode) => {
            //     console.log(qrcode)
            // })

            return reply.status(200).send({
                ok: true,
                data: {
                    ...result,
                    qr_code
                },
            })   
        } catch (error) {
            let message = 'Erro ao realizar a configuração do MFA.'

            if (error instanceof Error) message = error.message
            
            return reply.status(400).send({
                ok: false,
                message
            })
        }
    })
}