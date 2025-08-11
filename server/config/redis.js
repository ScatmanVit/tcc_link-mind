import Redis from 'ioredis'
import dotenv from 'dotenv'
dotenv.config()

const redis = new Redis(process.env.REDIS, {
  tls: undefined, 
  connectTimeout: 5000,
  enableOfflineQueue: false,
})

redis.on('connect', () => {
  console.log('Redis conectado com sucesso!')
})

redis.on('error', (err) => {
  console.error('Erro no Redis:', err)
})

export default redis
