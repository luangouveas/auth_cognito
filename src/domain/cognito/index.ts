import { AdminCreateUserCommand, AdminInitiateAuthCommand, AdminResetUserPasswordCommand, AssociateSoftwareTokenCommand, ChangePasswordCommand, CognitoIdentityProviderClient, ConfirmForgotPasswordCommand, ConfirmSignUpCommand, ForgotPasswordCommand, ResendConfirmationCodeCommand, RespondToAuthChallengeCommand, VerifySoftwareTokenCommand } from '@aws-sdk/client-cognito-identity-provider'
import { generateSecretHash } from "@/utils";
import { env } from '@/config/env';
import { IChangePassword, IConfirmForgotPassword, IRespondNewPasswordChallenge, IRespondToAuthChallenge } from './contracts';

const client = new CognitoIdentityProviderClient({
    region: env.AWS_REGION,
}) 

export default {
    /**
     * Cria um novo usuário no grupo de usuários especificado.
     * @param resend_temporary_password Se verdadeiro, será reenviado e-mail contendo a senha de acesso temporária. Se falso ou omitido, será realizada a tentativa de criação do usuário.
     */
    admin_create_user: async (username: string, resend_temporary_password: boolean = false) => {
        const cmd = new AdminCreateUserCommand({
            Username: username,
            UserPoolId: env.COGNITO_USER_POOL_ID,
            MessageAction: resend_temporary_password ? 'RESEND' : undefined,
        })
        return await client.send(cmd)
    },

    /**
     * Confirma a conta de um novo usuário.
     */
    confirm_sign_up: async (username: string, code: string) => {
        const cmd = new ConfirmSignUpCommand({
            ClientId: env.COGNITO_APP_CLIENT_ID,
            Username: username,
            ConfirmationCode: code,
            SecretHash: generateSecretHash(username),
        })
        return await client.send(cmd)
    },

    /**
     * Inicia um fluxo de autenticação.
     */
    admin_initiate_auth: async (username: string, password: string) => {
        const cmd = new AdminInitiateAuthCommand({
            UserPoolId: env.COGNITO_USER_POOL_ID,
            ClientId: env.COGNITO_APP_CLIENT_ID,
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            AuthParameters: {
                SECRET_HASH: generateSecretHash(username),
                USERNAME: username,
                PASSWORD: password,
            },
        })
        return await client.send(cmd)
    },

    /**
     *  Envia um código de confirmação de redefinição de senha para o usuário. O método de entrega da mensagem é determinado pelos atributos disponíveis do usuário e pela AccountRecoverySettingconfiguração do grupo de usuários.
     * */
    forgot_password: async (username: string) => {
        const cmd = new ForgotPasswordCommand({
            ClientId: env.COGNITO_APP_CLIENT_ID,
            Username: username,
            SecretHash: generateSecretHash(username),
        })
        return await client.send(cmd)
    },

    /**
     * Define uma nova senha escolhida pelo usuário através da confirmação de um código enviado previamente.
     */
    confirm_forgot_password: async ({ username, code, password }: IConfirmForgotPassword) => {
        const cmd = new ConfirmForgotPasswordCommand({
            ClientId: env.COGNITO_APP_CLIENT_ID,
            Username: username,
            ConfirmationCode: code,
            Password: password,
            SecretHash: generateSecretHash(username),
        })
        return await client.send(cmd)
    },

    /**
     * Reenvia o código que confirma uma nova conta para um usuário que se cadastrou no seu grupo de usuários.
     */
    resend_confirmation_code: async (username: string) => {
        const cmd = new ResendConfirmationCodeCommand({
            ClientId: env.COGNITO_APP_CLIENT_ID,
            SecretHash: generateSecretHash(username),
            Username: username,
        })
        return await client.send(cmd)
    },

    /**
     * Inicia a configuração do software MFA e retorna um código secreto que pode ser usado para configuração com leitura através de QRCode
     */
    associate_software_token: async (session: string) => {
        const cmd = new AssociateSoftwareTokenCommand({
            Session: session,
        })
        return await client.send(cmd)
    },

    /**
     * Finaliza a configuração do software MFA confirmando o código inicial e alterando o status do usuário para "Verificado"
     */
    verify_software_token: async (code: string, session: string) => {
        const cmd = new VerifySoftwareTokenCommand({
            UserCode: code,
            Session: session
        })
        return await client.send(cmd)
    },

    /**
     * Realiza verificação do código gerado pelo software MFA
     */
    respond_to_software_token_mfa_challenge: async ({ session, code, username }: IRespondToAuthChallenge) => {
        const cmd = new RespondToAuthChallengeCommand({
            ChallengeName: 'SOFTWARE_TOKEN_MFA',
            ClientId: env.COGNITO_APP_CLIENT_ID,
            Session: session,
            ChallengeResponses: {
                SOFTWARE_TOKEN_MFA_CODE: code,
                USERNAME: username,
            }
            
        })
        return await client.send(cmd)
    },
    
    /**
     * Define uma nova senha para o usuário após o primeiro login bem-sucedido
    */
   respond_new_password_challenge: async ({ username, password, session }: IRespondNewPasswordChallenge) => {
       const cmd = new RespondToAuthChallengeCommand({
           ChallengeName: 'NEW_PASSWORD_REQUIRED',
           ClientId: env.COGNITO_APP_CLIENT_ID,
           Session: session,           
           ChallengeResponses: {
                SECRET_HASH: generateSecretHash(username),
                NEW_PASSWORD: password,
                USERNAME: username,
            }
        })
        return await client.send(cmd)
    },

    /**
     * [Para uso de ADMIN] Inicia o processo de redefinição de senha de um usuário e define o status do usuário para "Forçar alteração de senha".
     */
    admin_reset_user_password: async (username: string) => {
        const cmd = new AdminResetUserPasswordCommand({
            Username: username,
            UserPoolId: env.COGNITO_USER_POOL_ID,
        })
        return await client.send(cmd)
    },

    /**
     * Atualiza a senha do usuário autenticado.
     */
    change_password: async ({ access_token, previus_password, new_password }: IChangePassword) => {
        const cmd = new ChangePasswordCommand({
            AccessToken: access_token,
            PreviousPassword: previus_password,
            ProposedPassword: new_password
        })
        return await client.send(cmd)
    }


}