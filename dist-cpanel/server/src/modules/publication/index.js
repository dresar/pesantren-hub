"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publication = void 0;
const hono_1 = require("hono");
const publication_controller_1 = require("./publication.controller");
const auth_1 = require("../../middleware/auth");
const middleware_1 = require("./middleware");
const publication = new hono_1.Hono();
exports.publication = publication;
// Public Routes
publication.get('/articles', publication_controller_1.PublicationController.getArticles);
publication.get('/articles/id/:id', publication_controller_1.PublicationController.getArticleById);
publication.get('/articles/:slug', publication_controller_1.PublicationController.getArticleBySlug);
publication.get('/categories', publication_controller_1.PublicationController.getCategories);
publication.get('/volumes', publication_controller_1.PublicationController.getVolumes);
// Registration
publication.post('/register', auth_1.authMiddleware, publication_controller_1.PublicationController.registerAuthor);
publication.post('/register/new', publication_controller_1.PublicationController.registerNewAuthor); // Public registration
// Protected Routes (Authors)
// Apply middleware to specific routes or groups
publication.use('/author/*', auth_1.authMiddleware, middleware_1.authorMiddleware);
publication.put('/author/profile', publication_controller_1.PublicationController.updateAuthorProfile); // New endpoint
publication.get('/author/articles', publication_controller_1.PublicationController.getAuthorArticles);
publication.post('/author/articles', publication_controller_1.PublicationController.createArticle);
publication.put('/author/articles/:id', publication_controller_1.PublicationController.updateArticle);
publication.get('/author/articles/:id', publication_controller_1.PublicationController.getArticleById);
publication.delete('/author/articles/:id', publication_controller_1.PublicationController.deleteArticle);
publication.get('/author/dashboard-stats', publication_controller_1.PublicationController.getAuthorStats);
// Collaboration Routes
publication.post('/author/collaborations', publication_controller_1.PublicationController.createCollaboration);
publication.get('/author/collaborations', publication_controller_1.PublicationController.getCollaborations);
publication.get('/author/collaborations/:id', publication_controller_1.PublicationController.getCollaborationById);
publication.put('/author/collaborations/:id', publication_controller_1.PublicationController.updateCollaboration);
publication.delete('/author/collaborations/:id', publication_controller_1.PublicationController.deleteCollaboration);
publication.post('/author/collaborations/:id/members', publication_controller_1.PublicationController.addCollaborationMember);
publication.delete('/author/collaborations/:id/members/:memberId', publication_controller_1.PublicationController.removeCollaborationMember);
publication.get('/author/users/search', publication_controller_1.PublicationController.searchUsersForInvite);
publication.post('/author/collaborations/:id/invites', publication_controller_1.PublicationController.inviteCollaborator);
publication.post('/author/collaborations/:id/invites/:inviteId/respond', publication_controller_1.PublicationController.respondInvite);
// Protected Routes (Admin/Editor)
publication.use('/admin/*', auth_1.authMiddleware, middleware_1.editorMiddleware);
publication.get('/admin/articles', publication_controller_1.PublicationController.getAdminArticles); // New route
publication.get('/admin/categories', publication_controller_1.PublicationController.getAdminCategories);
publication.post('/admin/categories', publication_controller_1.PublicationController.createCategory);
publication.patch('/admin/categories/:id', publication_controller_1.PublicationController.updateCategory);
publication.delete('/admin/categories/:id', publication_controller_1.PublicationController.deleteCategory);
publication.get('/admin/volumes', publication_controller_1.PublicationController.getVolumes);
publication.post('/admin/volumes', publication_controller_1.PublicationController.createVolume);
publication.delete('/admin/volumes/:id', publication_controller_1.PublicationController.deleteVolume);
publication.put('/admin/articles/:id/approve', publication_controller_1.PublicationController.approveArticle);
publication.put('/admin/articles/:id/reject', publication_controller_1.PublicationController.rejectArticle);
publication.delete('/admin/articles/:id', publication_controller_1.PublicationController.deleteArticle); // Admin delete
publication.get('/admin/authors/pending', publication_controller_1.PublicationController.getPendingAuthors);
publication.put('/admin/authors/:id/verify', publication_controller_1.PublicationController.verifyAuthor);
publication.get('/admin/stats', publication_controller_1.PublicationController.getDashboardStats);
