import { handle } from 'hono/vercel'
import app from '../server/src/index'

export const config = {
  runtime: 'nodejs',
}

export default async function (req: any, res: any) {
  try {
    return await handle(app)(req, res)
  } catch (err: any) {
    console.error('Vercel Initialization Fatal Error:', err)
    return new Response(JSON.stringify({ 
      error: 'Initialization Error', 
      message: err?.message, 
      stack: err?.stack,
      hint: 'Check if all environment variables are set and native modules are compatible.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
