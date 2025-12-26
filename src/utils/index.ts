import crypto from 'crypto'
import { env } from '@/config/env'

export const generateSecretHash = (str: string) => crypto.createHmac('sha256', env.COGNITO_APP_SECRET_KEY).update(str + env.COGNITO_APP_CLIENT_ID).digest('base64')