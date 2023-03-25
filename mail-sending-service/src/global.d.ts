declare global {
    namespace NodeJS {
        interface ProcessEnv {
            RABBITMQ_SERVER: string,
            SMTP_SERVICE?: string,
            SMTP_USER?: string,
            SMTP_PASSWORD?: string,
        }
    }
}

export {}