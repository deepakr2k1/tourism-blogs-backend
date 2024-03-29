import { Request, Response, NextFunction } from "express"

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: number,
            DB_URI: string,
            ACCESS_TOKEN_EXPIRATION: number,
            COOKIE_EXPIRATION: number,
            ACCESS_SECRET_KEY: string,
            RABBITMQ_SERVER: string
        }
    }
    interface Req extends Request {
        user?: any
    }
    interface Res extends Response {}
    interface Next extends NextFunction {}
}

export {}