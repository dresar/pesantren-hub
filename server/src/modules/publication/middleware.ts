import { Context, Next } from 'hono';
import { db } from '../../db';
import { users } from '../../db/schema';
import { eq } from 'drizzle-orm';

export const authorMiddleware = async (c: Context, next: Next) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  // Check verification status from DB (fresh check)
  // Superadmin bypass verification
  if (user.role === 'superadmin') {
      await next();
      return;
  }

  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    columns: { 
      isVerified: true, 
      verificationStatus: true,
      publicationRole: true,
      publicationStatus: true,
      publicationVerified: true
    }
  });

  // Check if user has author role OR publication role
  const isAuthor = user.role === 'author' || dbUser?.publicationRole === 'author';
  
  if (!isAuthor && !['editor', 'reviewer'].includes(user.role)) {
     return c.json({ error: 'Forbidden: Author access required' }, 403);
  }

  // Use publicationVerified if available, otherwise fallback to legacy isVerified
  const isVerified = dbUser?.publicationVerified || dbUser?.isVerified;
  const status = dbUser?.publicationStatus !== 'none' ? dbUser?.publicationStatus : dbUser?.verificationStatus;

  if (!dbUser || !isVerified) {
    return c.json({ 
      error: 'Forbidden: Account not verified', 
      status: status
    }, 403);
  }

  await next();
};

export const editorMiddleware = async (c: Context, next: Next) => {
  const user = c.get('user');
  if (!user) return c.json({ error: 'Unauthorized' }, 401);

  const allowedRoles = ['editor', 'superadmin'];
  if (!allowedRoles.includes(user.role)) {
    return c.json({ error: 'Forbidden: Editor access required' }, 403);
  }
  await next();
};
