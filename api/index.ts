import { handle } from 'hono/vercel'

export const config = {
  runtime: 'nodejs',
}

export default async function (req: any, res: any) {
  try {
    // Lazy load the app to catch initialization/import errors
    const appModule = await import('../server/src/index');
    const app = appModule.default;
    
    // The handle(app) function in Hono/Vercel takes (req, res) for Node.js runtime
    // but TS might think it only takes 1 if not configured correctly.
    // Casting to any to satisfy the build error while maintaining functionality.
    return (handle(app) as any)(req, res);
  } catch (err: any) {
    console.error('Vercel Initialization Fatal Error:', err);
    return new Response(JSON.stringify({ 
      error: 'Initialization Error', 
      message: err?.message, 
      stack: err?.stack,
      hint: 'This error occurred during app startup.'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
