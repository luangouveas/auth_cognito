import { z } from 'zod'

const env_schema = z.object({
    API_PORT: z.coerce.number().default(3333),
    AWS_REGION: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    COGNITO_USER_POOL_ID: z.string(),
    COGNITO_APP_CLIENT_ID: z.string(),
    COGNITO_APP_SECRET_KEY: z.string(),
})

const variables = {
    API_PORT: process.env.API_PORT,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
    COGNITO_APP_CLIENT_ID: process.env.COGNITO_APP_CLIENT_ID,
    COGNITO_APP_SECRET_KEY: process.env.COGNITO_APP_SECRET_KEY,
}

const result = env_schema.safeParse(variables)

if (result.error){
    throw new Error('Variaveis de ambiente incorretas!')
}

export const env = result.data