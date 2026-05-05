"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../db");
const schema_1 = require("../../db/schema");
const auth_1 = require("../../middleware/auth");
const paymentsModule = new hono_1.Hono();
paymentsModule.get('/banks', async (c) => {
    const banks = await db_1.db.query.bankAccounts.findMany({
        where: (0, drizzle_orm_1.eq)(schema_1.bankAccounts.isActive, true),
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.bankAccounts.order)],
    });
    return c.json({ data: banks });
});
paymentsModule.use('*', auth_1.authMiddleware);
paymentsModule.get('/', auth_1.adminMiddleware, async (c) => {
    const list = await db_1.db.query.payments.findMany({
        with: {
            santri: true,
            verifiedBy: {
                columns: { id: true, username: true, firstName: true, lastName: true },
            },
        },
        orderBy: [(0, drizzle_orm_1.desc)(schema_1.payments.createdAt)],
        limit: 100,
    });
    return c.json({ data: list });
});
paymentsModule.get('/:id', auth_1.adminMiddleware, async (c) => {
    const id = Number(c.req.param('id'));
    const item = await db_1.db.query.payments.findFirst({
        where: (0, drizzle_orm_1.eq)(schema_1.payments.id, id),
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
paymentsModule.put('/:id', auth_1.adminMiddleware, async (c) => {
    const id = Number(c.req.param('id'));
    const body = await c.req.json();
    const user = c.get('user');
    const status = body.status;
    const catatan = body.catatan || '';
    await db_1.db.update(schema_1.payments)
        .set({
        status,
        catatan,
        verifiedAt: status === 'verified' ? new Date().toISOString() : null,
        verifiedById: status === 'verified' ? user.id : null,
        updatedAt: new Date().toISOString(),
    })
        .where((0, drizzle_orm_1.eq)(schema_1.payments.id, id));
    const payment = await db_1.db.query.payments.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.payments.id, id) });
    if (payment) {
        await db_1.db.update(schema_1.santri)
            .set({
            status: status === 'verified' ? 'verified' : status === 'rejected' ? 'submitted' : 'pending',
            updatedAt: new Date().toISOString(),
        })
            .where((0, drizzle_orm_1.eq)(schema_1.santri.id, payment.santriId));
        const santriRecord = await db_1.db.query.santri.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.santri.id, payment.santriId) });
        if (santriRecord) {
            let targetUser = await db_1.db.query.users.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.users.email, santriRecord.email) });
            if (!targetUser && santriRecord.noHp) {
                targetUser = await db_1.db.query.users.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.users.phone, santriRecord.noHp) });
            }
            if (targetUser) {
                const title = status === 'verified'
                    ? 'Pembayaran Diverifikasi'
                    : status === 'rejected'
                        ? 'Pembayaran Ditolak'
                        : 'Pembayaran Diperbarui';
                const message = status === 'verified'
                    ? 'Pembayaran biaya pendaftaran Anda telah diverifikasi. Silakan lanjut ke tahap berikutnya.'
                    : status === 'rejected'
                        ? `Pembayaran Anda ditolak. ${catatan ? `Catatan: ${catatan}` : 'Silakan periksa kembali bukti dan data transfer.'}`
                        : 'Status pembayaran Anda diperbarui menjadi pending.';
                const actionUrl = status === 'verified' ? '/app/status' : '/app/pembayaran';
                await db_1.db.insert(schema_1.notifications).values({
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
paymentsModule.post('/:id/cancel', auth_1.adminMiddleware, async (c) => {
    const id = Number(c.req.param('id'));
    const payment = await db_1.db.query.payments.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.payments.id, id) });
    if (!payment)
        return c.json({ error: 'Not found' }, 404);
    if (payment.status !== 'verified') {
        return c.json({ error: 'Only verified payments can be canceled' }, 400);
    }
    await db_1.db.update(schema_1.payments)
        .set({
        status: 'pending',
        verifiedAt: null,
        verifiedById: null,
        updatedAt: new Date().toISOString(),
        catatan: 'Verifikasi dibatalkan',
    })
        .where((0, drizzle_orm_1.eq)(schema_1.payments.id, id));
    await db_1.db.update(schema_1.santri)
        .set({ status: 'submitted', updatedAt: new Date().toISOString() })
        .where((0, drizzle_orm_1.eq)(schema_1.santri.id, payment.santriId));
    const santriRecord = await db_1.db.query.santri.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.santri.id, payment.santriId) });
    if (santriRecord) {
        let targetUser = await db_1.db.query.users.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.users.email, santriRecord.email) });
        if (!targetUser && santriRecord.noHp) {
            targetUser = await db_1.db.query.users.findFirst({ where: (0, drizzle_orm_1.eq)(schema_1.users.phone, santriRecord.noHp) });
        }
        if (targetUser) {
            await db_1.db.insert(schema_1.notifications).values({
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
exports.default = paymentsModule;
