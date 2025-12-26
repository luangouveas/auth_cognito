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
            }),
            response: {
                200: z.object({
                    ok: z.literal(true),
                    data: z.object({
                        session: z.string().optional(),
                        secretCode: z.string().optional(),
                        qrCode: z.string(),
                    })
                })
            }
        }
    }, async (request, reply) => {
        const { session, username, appName } = request.body

        const result = await cognito.associate_software_token(session)        
        const otpauthUri = `otpauth://totp/${encodeURIComponent(appName)}:${encodeURIComponent(username)}?secret=${result.SecretCode}&issuer=${encodeURIComponent(appName)}&algorithm=SHA1&digits=6&period=30`;

        const qrCode = await qrcode.toDataURL(otpauthUri, {
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
                session: result.Session,
                secretCode: result.SecretCode,
                qrCode
            },
        })   
    })
}