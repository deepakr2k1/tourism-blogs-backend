import { RedisClientOptions } from 'redis';

export const ALLOWED_ORIGINS: string[] = [
    `http://localhost:3000`
];

export const redisCacheOptions = {
    host: 'localhost',
    port: 6378
} as RedisClientOptions;

export const HASH_SALT: number =  10;
export const OTP_AGE: number =  30 * 60 * 1000;
export const ACCESS_TOKEN_EXPIRATION: number = 604800000;
export const COOKIE_EXPIRATION: number = 604800000;
export const DEFAULT_CACHE_EXPIRATION: number = 3600;
export const MAX_SNIPPET_LENGTH: number = 100;