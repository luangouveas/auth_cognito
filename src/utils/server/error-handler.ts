import { FastifyInstance } from "fastify";
import { hasZodFastifySchemaValidationErrors, ResponseSerializationError } from "fastify-type-provider-zod";
import { ZodError } from "zod";
import { UnauthorizedError } from "./unauthorized-error";
import { BadRequestError } from "./bad-request-error";

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: FastifyErrorHandler = (error, _, reply) => {
    if (error instanceof ZodError){
        const errors = error.issues.map((e) => ({
            path: e.path.join('.'),
            message: e.message || 'Valor do parametro inválido.',
        }))

        return reply.status(400).send({
            ok: false,
            message: error.message,
            errors
        })
    }

    if (hasZodFastifySchemaValidationErrors(error)){
        const errors = error.validation.map((e) => ({
            path:
                e.instancePath.length > 1
                ? e.instancePath.split('/').slice(1).join('.')
                : e.instancePath.slice(1) || error.validationContext || '',
            message: e.message || 'Valor do parametro inválido.',
        }))

        return reply.status(400).send({
            ok: false,
            message: error.message,
            errors
        })
    }

    if (error instanceof ResponseSerializationError){
        const errors = error.cause.issues.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
        }))

        return reply.status(500).send({
            ok: false,
            message: error.message,
            errors
        })
    }

    if (error instanceof BadRequestError){
        return reply.status(400).send({
            ok: false,
            message: error.message,
        })
    }

    if (error instanceof UnauthorizedError){
        return reply.status(401).send({
            ok: false,
            message: error.message,
        })
    }


    return reply.status(500).send({
            ok: false,
            message: 'Internal Server Error',
    })
}