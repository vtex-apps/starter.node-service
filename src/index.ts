import dotenv from 'dotenv'

// dotenv config must be loaded before anything else
dotenv.config({ path: './src/.env' })

// eslint-disable-next-line import/first
import { app, server } from './server'

export { app, server }
