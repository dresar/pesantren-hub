import { PublicationService } from './publication.service';
import { createArticleSchema, updateArticleSchema, approvalSchema, createCategorySchema, updateCategorySchema, createVolumeSchema, publicationFilterSchema, authorRegistrationSchema, newAuthorRegistrationSchema, createCollaborationSchema, updateCollaborationSchema, addCollaborationMemberSchema, inviteCollaborationSchema, respondInviteSchema } from './publication.schema';
import jwt from 'jsonwebtoken';
const getJwtSecret = () => process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this';
export class PublicationController {
    // Author Registration
    static async registerAuthor(c) {
        const user = c.get('user');
        const body = await c.req.json();
        const validation = authorRegistrationSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const result = await PublicationService.registerAuthor(user.id, validation.data);
            return c.json({ data: result, message: 'Pendaftaran penulis berhasil. Menunggu verifikasi admin.' }, 201);
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal mendaftar sebagai penulis' }, 500);
        }
    }
    static async registerNewAuthor(c) {
        const body = await c.req.json();
        const validation = newAuthorRegistrationSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const user = await PublicationService.registerNewAuthor(validation.data);
            // Auto login
            const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, getJwtSecret(), { expiresIn: '1d' });
            const refreshToken = jwt.sign({ id: user.id }, getJwtSecret(), { expiresIn: '7d' });
            return c.json({
                message: 'Pendaftaran berhasil',
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    isVerified: user.isVerified,
                    verificationStatus: user.verificationStatus,
                    publicationRole: user.publicationRole,
                    publicationStatus: user.publicationStatus,
                    isPublicationRegistered: user.isPublicationRegistered,
                    publicationVerified: user.publicationVerified,
                },
                token,
                refreshToken
            }, 201);
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal mendaftar' }, 500);
        }
    }
    static async updateAuthorProfile(c) {
        const user = c.get('user');
        const body = await c.req.json();
        // Validate basic fields (reuse registration schema or create new one)
        // For now, we manually validate or trust partial updates since it's an update
        try {
            await PublicationService.updateAuthorProfile(user.id, body);
            return c.json({ message: 'Profil berhasil diperbarui' });
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal memperbarui profil' }, 500);
        }
    }
    // Articles
    static async createArticle(c) {
        const user = c.get('user');
        const body = await c.req.json();
        const validation = createArticleSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const article = await PublicationService.createArticle(validation.data, user.id);
            return c.json({ data: article[0], message: 'Artikel berhasil dibuat' }, 201);
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal membuat artikel' }, 500);
        }
    }
    static async updateArticle(c) {
        const id = Number(c.req.param('id'));
        const user = c.get('user');
        const body = await c.req.json();
        const validation = updateArticleSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const article = await PublicationService.updateArticle(id, user.id, validation.data);
            return c.json({ data: article[0], message: 'Artikel berhasil diupdate' });
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal update artikel' }, 500);
        }
    }
    static async approveArticle(c) {
        const id = Number(c.req.param('id'));
        const user = c.get('user');
        try {
            const article = await PublicationService.approveArticle(id, user.id);
            // TODO: Send notification
            return c.json({ data: article[0], message: 'Artikel disetujui' });
        }
        catch (e) {
            return c.json({ error: 'Gagal menyetujui artikel' }, 500);
        }
    }
    static async rejectArticle(c) {
        const id = Number(c.req.param('id'));
        const body = await c.req.json();
        const validation = approvalSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const article = await PublicationService.rejectArticle(id, validation.data.rejectionReason || 'No reason provided');
            // TODO: Send notification
            return c.json({ data: article[0], message: 'Artikel ditolak' });
        }
        catch (e) {
            return c.json({ error: 'Gagal menolak artikel' }, 500);
        }
    }
    static async getArticles(c) {
        const query = c.req.query();
        const validation = publicationFilterSchema.safeParse(query);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            // For public endpoint, force status to 'approved' unless it's specifically for admin which uses a different endpoint
            // actually, let's just default to approved if not specified, but for security, public should ONLY see approved.
            // So we override status to 'approved'.
            const filters = { ...validation.data, status: 'approved' };
            const result = await PublicationService.getArticles(filters);
            return c.json(result);
        }
        catch (e) {
            return c.json({ error: 'Gagal mengambil artikel' }, 500);
        }
    }
    static async getAdminArticles(c) {
        const query = c.req.query();
        const validation = publicationFilterSchema.safeParse(query);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            // Admin can see all statuses
            const result = await PublicationService.getArticles(validation.data);
            return c.json(result);
        }
        catch (e) {
            console.error('[Publication] getAdminArticles error:', e?.message ?? e);
            return c.json({
                error: 'Gagal mengambil artikel admin',
                ...(process.env.NODE_ENV !== 'production' && e?.message && { details: e.message }),
            }, 500);
        }
    }
    static async getAuthorArticles(c) {
        const user = c.get('user');
        const query = c.req.query();
        const validation = publicationFilterSchema.safeParse(query);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const filters = { ...validation.data, authorId: user.id };
            const result = await PublicationService.getArticles(filters);
            return c.json(result);
        }
        catch (e) {
            console.error('[Publication] getAuthorArticles error:', e?.message ?? e);
            return c.json({ error: 'Gagal mengambil daftar artikel' }, 500);
        }
    }
    static async getArticleBySlug(c) {
        const slug = c.req.param('slug');
        try {
            const article = await PublicationService.getArticleBySlug(slug);
            if (!article)
                return c.json({ error: 'Artikel tidak ditemukan' }, 404);
            return c.json({ data: article });
        }
        catch (e) {
            return c.json({ error: 'Gagal mengambil artikel' }, 500);
        }
    }
    static async getArticleById(c) {
        const id = Number(c.req.param('id'));
        try {
            const article = await PublicationService.getArticleById(id);
            if (!article)
                return c.json({ error: 'Artikel tidak ditemukan' }, 404);
            return c.json({ data: article });
        }
        catch (e) {
            return c.json({ error: 'Gagal mengambil artikel' }, 500);
        }
    }
    static async deleteArticle(c) {
        const id = Number(c.req.param('id'));
        try {
            await PublicationService.deleteArticle(id);
            return c.json({ message: 'Artikel berhasil dihapus' });
        }
        catch (e) {
            return c.json({ error: 'Gagal menghapus artikel' }, 500);
        }
    }
    // Categories
    static async createCategory(c) {
        const body = await c.req.json();
        const validation = createCategorySchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const category = await PublicationService.createCategory(validation.data);
            return c.json({ data: category[0], message: 'Kategori berhasil dibuat' }, 201);
        }
        catch (e) {
            return c.json({ error: 'Gagal membuat kategori' }, 500);
        }
    }
    static async getCategories(c) {
        const type = c.req.query('type');
        try {
            const categories = await PublicationService.getCategories(type);
            return c.json({ data: categories });
        }
        catch (e) {
            return c.json({ error: 'Gagal mengambil kategori' }, 500);
        }
    }
    static async getAdminCategories(c) {
        try {
            const categories = await PublicationService.getAdminCategories();
            return c.json({ data: categories });
        }
        catch (e) {
            return c.json({ error: 'Gagal mengambil kategori' }, 500);
        }
    }
    static async updateCategory(c) {
        const id = Number(c.req.param('id'));
        const body = await c.req.json();
        const validation = updateCategorySchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const category = await PublicationService.updateCategory(id, validation.data);
            return c.json({ data: category[0], message: 'Kategori berhasil diperbarui' });
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal memperbarui kategori' }, 500);
        }
    }
    static async deleteCategory(c) {
        const id = Number(c.req.param('id'));
        try {
            await PublicationService.deleteCategory(id);
            return c.json({ message: 'Kategori berhasil dihapus' });
        }
        catch (e) {
            return c.json({ error: 'Gagal menghapus kategori' }, 500);
        }
    }
    // Volumes
    static async createVolume(c) {
        const body = await c.req.json();
        const validation = createVolumeSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const volume = await PublicationService.createVolume(validation.data);
            return c.json({ data: volume[0], message: 'Volume berhasil dibuat' }, 201);
        }
        catch (e) {
            return c.json({ error: 'Gagal membuat volume' }, 500);
        }
    }
    static async getVolumes(c) {
        try {
            const volumes = await PublicationService.getVolumes();
            return c.json({ data: volumes });
        }
        catch (e) {
            return c.json({ error: 'Gagal mengambil volume' }, 500);
        }
    }
    static async deleteVolume(c) {
        const id = Number(c.req.param('id'));
        try {
            await PublicationService.deleteVolume(id);
            return c.json({ message: 'Volume berhasil dihapus' });
        }
        catch (e) {
            return c.json({ error: 'Gagal menghapus volume' }, 500);
        }
    }
    // Author Verification
    static async verifyAuthor(c) {
        const id = Number(c.req.param('id'));
        const body = await c.req.json();
        const { status, reason } = body; // status: 'approved' | 'rejected' | 'pending'
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return c.json({ error: 'Status tidak valid' }, 400);
        }
        try {
            const user = await PublicationService.verifyAuthor(id, status, reason);
            let message = '';
            if (status === 'approved')
                message = 'Penulis berhasil diverifikasi';
            else if (status === 'rejected')
                message = 'Penulis ditolak';
            else
                message = 'Verifikasi dibatalkan (status kembali pending)';
            return c.json({ data: user[0], message });
        }
        catch (e) {
            return c.json({ error: 'Gagal verifikasi penulis' }, 500);
        }
    }
    static async getPendingAuthors(c) {
        try {
            // Actually getting ALL authors for admin management now
            const authors = await PublicationService.getAdminAuthors();
            return c.json({ data: authors });
        }
        catch (e) {
            return c.json({ error: 'Gagal mengambil data penulis' }, 500);
        }
    }
    static async getDashboardStats(c) {
        try {
            const stats = await PublicationService.getDashboardStats();
            return c.json({ data: stats });
        }
        catch (e) {
            return c.json({ error: 'Gagal mengambil statistik' }, 500);
        }
    }
    static async getAuthorStats(c) {
        const user = c.get('user');
        try {
            const stats = await PublicationService.getAuthorStats(user.id);
            return c.json({ data: stats });
        }
        catch (e) {
            return c.json({ error: 'Gagal mengambil statistik penulis' }, 500);
        }
    }
    // Collaborations
    static async createCollaboration(c) {
        const user = c.get('user');
        const body = await c.req.json();
        const validation = createCollaborationSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const result = await PublicationService.createCollaboration(user.id, validation.data);
            return c.json({ data: result, message: 'Kolaborasi berhasil dibuat' }, 201);
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal membuat kolaborasi' }, 500);
        }
    }
    static async getCollaborations(c) {
        const user = c.get('user');
        try {
            const data = await PublicationService.getCollaborations(user.id);
            return c.json({ data });
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal mengambil data kolaborasi' }, 500);
        }
    }
    static async getCollaborationById(c) {
        const user = c.get('user');
        const id = Number(c.req.param('id'));
        try {
            const data = await PublicationService.getCollaborationById(id, user.id);
            return c.json({ data });
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal mengambil detail kolaborasi' }, 500);
        }
    }
    static async updateCollaboration(c) {
        const user = c.get('user');
        const id = Number(c.req.param('id'));
        const body = await c.req.json();
        const validation = updateCollaborationSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const data = await PublicationService.updateCollaboration(id, user.id, validation.data);
            return c.json({ data, message: 'Proyek kolaborasi berhasil diperbarui' });
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal memperbarui kolaborasi' }, 500);
        }
    }
    static async deleteCollaboration(c) {
        const user = c.get('user');
        const id = Number(c.req.param('id'));
        try {
            await PublicationService.deleteCollaboration(id, user.id);
            return c.json({ message: 'Proyek kolaborasi berhasil dihapus' });
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal menghapus kolaborasi' }, 500);
        }
    }
    static async addCollaborationMember(c) {
        const user = c.get('user');
        const id = Number(c.req.param('id'));
        const body = await c.req.json();
        const validation = addCollaborationMemberSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const result = await PublicationService.addCollaborationMember(id, user.id, validation.data);
            return c.json({ data: result, message: 'Anggota berhasil ditambahkan' });
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal menambahkan anggota' }, 500);
        }
    }
    static async inviteCollaborator(c) {
        const user = c.get('user');
        const id = Number(c.req.param('id'));
        const body = await c.req.json();
        const validation = inviteCollaborationSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const result = await PublicationService.inviteCollaborator(id, user.id, validation.data);
            return c.json({ data: result, message: 'Undangan kolaborasi dikirim' }, 201);
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal mengirim undangan' }, 500);
        }
    }
    static async searchUsersForInvite(c) {
        const q = (c.req.query('q') || '').trim();
        if (q.length < 3) {
            return c.json({ data: [] });
        }
        try {
            const user = c.get('user');
            const list = await PublicationService.searchUsersForInvite(q, 10, user.id);
            return c.json({ data: list });
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal mencari user' }, 500);
        }
    }
    static async respondInvite(c) {
        const user = c.get('user');
        const id = Number(c.req.param('id'));
        const inviteId = Number(c.req.param('inviteId'));
        const body = await c.req.json();
        const validation = respondInviteSchema.safeParse(body);
        if (!validation.success) {
            return c.json({ error: validation.error.flatten() }, 400);
        }
        try {
            const res = await PublicationService.respondInvite(id, inviteId, user.id, validation.data);
            return c.json({ data: res });
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal memproses undangan' }, 500);
        }
    }
    static async removeCollaborationMember(c) {
        const user = c.get('user');
        const id = Number(c.req.param('id')); // Collaboration ID
        const memberId = Number(c.req.param('memberId')); // Member User ID
        try {
            await PublicationService.removeCollaborationMember(id, user.id, memberId);
            return c.json({ message: 'Anggota berhasil dihapus' });
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal menghapus anggota' }, 500);
        }
    }
    static async getArticleDiscussions(c) {
        const user = c.get('user');
        const articleId = Number(c.req.param('id'));
        try {
            const data = await PublicationService.getArticleDiscussions(articleId, user.id);
            return c.json({ data });
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal mengambil diskusi' }, 500);
        }
    }
    static async postArticleDiscussion(c) {
        const user = c.get('user');
        const articleId = Number(c.req.param('id'));
        const body = await c.req.json();
        try {
            const item = await PublicationService.postArticleDiscussion(articleId, user.id, body.content, body.parentId);
            return c.json({ data: item, message: 'Komentar ditambahkan' }, 201);
        }
        catch (e) {
            return c.json({ error: e.message || 'Gagal menambahkan komentar' }, 500);
        }
    }
}
