import * as Redis from 'redis';
import { redisCacheOptions } from '../config';

const redisCache  = Redis.createClient(redisCacheOptions);

redisCache.connect()
    .then(() => { console.info(`Connected to Redis Server`) })
    .catch((err) => { console.error(err) });

export default redisCache; 