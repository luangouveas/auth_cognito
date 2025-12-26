import Fastify from 'fastify'
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod'
import { signInRoute } from './routes/sign_in'
import { signUpRoute } from './routes/sign_up'
import { confirmSignUpRoute } from './routes/confirm_sign_up'
import { resendConfirmationCodeRoute } from './routes/resend_confirmation_code'
import { adminResetUserPasswordRoute } from './routes/admin_reset_user_password'
import { associateSoftwareTokenRoute } from './routes/associate_software_token'
import { changePasswordRoute } from './routes/change_password'
import { confirmForgotPasswordRoute } from './routes/confirm_forgot_password'
import { respondToSoftwareTokenMfaChallengeRoute } from './routes/respond_to_software_token_mfa_challenge'
import { respondToNewPasswordChallengeRoute } from './routes/respond_to_new_password_challenge'
import { env } from './config/env'

const fastify = Fastify({
  logger: false
}).withTypeProvider<ZodTypeProvider>()

fastify.setSerializerCompiler(serializerCompiler)
fastify.setValidatorCompiler(validatorCompiler)

fastify.get('/', function (_, reply) {
  reply.send({ ok: true, message: 'API online' })
})

fastify.register(signUpRoute)
fastify.register(signInRoute)
fastify.register(confirmSignUpRoute)
fastify.register(resendConfirmationCodeRoute)
fastify.register(adminResetUserPasswordRoute)
fastify.register(associateSoftwareTokenRoute)
fastify.register(changePasswordRoute)
fastify.register(confirmForgotPasswordRoute)
fastify.register(respondToSoftwareTokenMfaChallengeRoute)
fastify.register(respondToNewPasswordChallengeRoute)

fastify.listen({ port: env.API_PORT }, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`Server running in http://localhost:${env.API_PORT}`)  
})