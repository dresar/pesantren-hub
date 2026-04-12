import { Hono } from 'hono';
import { eq, desc } from 'drizzle-orm';
import { db } from '../../db';
import { payments, bankAccounts, santri, users, notifications } from '../../db/schema';
import { authMiddleware, adminMiddleware, AuthUser } from '../../middleware/auth';
const paymentsModule = new Hono();
paymentsModule.get('/banks', async (c) => {
  const banks = await db.query.bankAccounts.findMany({
    where: eq(bankAccounts.isActive, true),
    orderBy: [desc(bankAccounts.order)],
  });
  return c.json({ data: banks });
});
paymentsModule.use('*', authMiddleware);
paymentsModule.get('/', adminMiddleware, async (c) => {
  const list = await db.query.payments.findMany({
    with: {
      santri: true,
      verifiedBy: {
        columns: { id: true, username: true, firstName: true, lastName: true },
      },
    },
    orderBy: [desc(payments.createdAt)],
    limit: 100,
  });
  return c.json({ data: list });
});
paymentsModule.get('/:id', adminMiddleware, async (c) => {
  const id = Number(c.req.param('id'));
  const item = await db.query.payments.findFirst({
    where: eq(payments.id, id),
    with: {
      santri: true,
      verifiedBy: {
        columns: { id: true, username: true, firstName: true, lastName: true },
      },
    },
  });
  if (!item) {
    return c.json({ error: 'Not found' }, 404);
  }
  return c.json({ data: item });
});
paymentsModule.put('/:id', adminMiddleware, async (c) => {
  const id = Number(c.req.param('id'));
  const body = await c.req.json();
  const user = c.get('user') as AuthUser;
  const status: "pending" | "verified" | "rejected" = body.status;
  const catatan = body.catatan || '';
  await db.update(payments)
    .set({
      status,
      catatan,
      verifiedAt: status === 'verified' ? new Date() : null,
      verifiedById: status === 'verified' ? user.id : null,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, id));
  const payment = await db.query.payments.findFirst({ where: eq(payments.id, id) });
  if (payment) {
    await db.update(santri)
      .set({
        status: status === 'verified' ? 'verified' : status === 'rejected' ? 'submitted' : 'pending',
        updatedAt: new Date(),
      })
      .where(eq(santri.id, payment.santriId));
    const santriRecord = await db.query.santri.findFirst({ where: eq(santri.id, payment.santriId) });
    if (santriRecord) {
      let targetUser = await db.query.users.findFirst({ where: eq(users.email, santriRecord.email) });
      if (!targetUser && santriRecord.noHp) {
        targetUser = await db.query.users.findFirst({ where: eq(users.phone, santriRecord.noHp) });
      }
      if (targetUser) {
        const title =
          status === 'verified'
            ? 'Pembayaran Diverifikasi'
            : status === 'rejected'
            ? 'Pembayaran Ditolak'
            : 'Pembayaran Diperbarui';
        const message =
          status === 'verified'
            ? 'Pembayaran biaya pendaftaran Anda telah diverifikasi. Silakan lanjut ke tahap berikutnya.'
            : status === 'rejected'
            ? `Pembayaran Anda ditolak. ${catatan ? `Catatan: ${catatan}` : 'Silakan periksa kembali bukti dan data transfer.'}`
            : 'Status pembayaran Anda diperbarui menjadi pending.';
        const actionUrl = status === 'verified' ? '/app/status' : '/app/pembayaran';
        await db.insert(notifications).values({
          userId: targetUser.id,
          title,
          message,
          type: status === 'verified' ? 'success' : status === 'rejected' ? 'warning' : 'info',
          isRead: false,
          actionUrl,
          createdAt: new Date().toISOString(),
        });
      }
    }
  }
  return c.json({ message: 'Updated' });
});
paymentsModule.post('/:id/cancel', adminMiddleware, async (c) => {
  const id = Number(c.req.param('id'));
  const payment = await db.query.payments.findFirst({ where: eq(payments.id, id) });
  if (!payment) return c.json({ error: 'Not found' }, 404);
  if (payment.status !== 'verified') {
    return c.json({ error: 'Only verified payments can be canceled' }, 400);
  }
  await db.update(payments)
    .set({
      status: 'pending',
      verifiedAt: null,
      verifiedById: null,
      updatedAt: new Date(),
      catatan: 'Verifikasi dibatalkan',
    })
    .where(eq(payments.id, id));
  await db.update(santri)
    .set({ status: 'submitted', updatedAt: new Date() })
    .where(eq(santri.id, payment.santriId));
  const santriRecord = await db.query.santri.findFirst({ where: eq(santri.id, payment.santriId) });
  if (santriRecord) {
    let targetUser = await db.query.users.findFirst({ where: eq(users.email, santriRecord.email) });
    if (!targetUser && santriRecord.noHp) {
      targetUser = await db.query.users.findFirst({ where: eq(users.phone, santriRecord.noHp) });
    }
    if (targetUser) {
      await db.insert(notifications).values({
        userId: targetUser.id,
        title: 'Verifikasi Pembayaran Dibatalkan',
        message: 'Verifikasi sebelumnya dibatalkan. Status pembayaran kembali pending.',
        type: 'warning',
        isRead: false,
        actionUrl: '/app/pembayaran',
        createdAt: new Date().toISOString(),
      });
    }
  }
  return c.json({ message: 'Canceled verification' });
});
export default paymentsModule;