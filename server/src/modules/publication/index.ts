import { Hono } from 'hono';
import { PublicationController } from './publication.controller';
import { authMiddleware } from '../../middleware/auth';
import { authorMiddleware, editorMiddleware } from './middleware';

const publication = new Hono();

// Public Routes
publication.get('/articles', PublicationController.getArticles);
publication.get('/articles/id/:id', PublicationController.getArticleById);
publication.get('/articles/:slug', PublicationController.getArticleBySlug);
publication.get('/categories', PublicationController.getCategories);
publication.get('/volumes', PublicationController.getVolumes);

// Registration
publication.post('/register', authMiddleware, PublicationController.registerAuthor);
publication.post('/register/new', PublicationController.registerNewAuthor); // Public registration

// Protected Routes (Authors)
// Apply middleware to specific routes or groups
publication.use('/author/*', authMiddleware, authorMiddleware);
publication.put('/author/profile', PublicationController.updateAuthorProfile); // New endpoint
publication.get('/author/articles', PublicationController.getAuthorArticles);
publication.post('/author/articles', PublicationController.createArticle);
publication.put('/author/articles/:id', PublicationController.updateArticle);
publication.get('/author/articles/:id', PublicationController.getArticleById);
publication.delete('/author/articles/:id', PublicationController.deleteArticle);
publication.get('/author/articles/:id/discussions', PublicationController.getArticleDiscussions);
publication.post('/author/articles/:id/discussions', PublicationController.postArticleDiscussion);
publication.get('/author/dashboard-stats', PublicationController.getAuthorStats); 

// Collaboration Routes
publication.post('/author/collaborations', PublicationController.createCollaboration);
publication.get('/author/collaborations', PublicationController.getCollaborations);
publication.get('/author/collaborations/:id', PublicationController.getCollaborationById);
publication.put('/author/collaborations/:id', PublicationController.updateCollaboration);
publication.delete('/author/collaborations/:id', PublicationController.deleteCollaboration);
publication.post('/author/collaborations/:id/members', PublicationController.addCollaborationMember);
publication.delete('/author/collaborations/:id/members/:memberId', PublicationController.removeCollaborationMember);
publication.get('/author/users/search', PublicationController.searchUsersForInvite);
publication.post('/author/collaborations/:id/invites', PublicationController.inviteCollaborator);
publication.post('/author/collaborations/:id/invites/:inviteId/respond', PublicationController.respondInvite);

// Protected Routes (Admin/Editor)
publication.use('/admin/*', authMiddleware, editorMiddleware); 
publication.get('/admin/articles', PublicationController.getAdminArticles); // New route
publication.get('/admin/categories', PublicationController.getAdminCategories);
publication.post('/admin/categories', PublicationController.createCategory);
publication.patch('/admin/categories/:id', PublicationController.updateCategory);
publication.delete('/admin/categories/:id', PublicationController.deleteCategory);
publication.get('/admin/volumes', PublicationController.getVolumes);
publication.post('/admin/volumes', PublicationController.createVolume);
publication.delete('/admin/volumes/:id', PublicationController.deleteVolume);
publication.put('/admin/articles/:id/approve', PublicationController.approveArticle);
publication.put('/admin/articles/:id/reject', PublicationController.rejectArticle);
publication.delete('/admin/articles/:id', PublicationController.deleteArticle); // Admin delete
publication.get('/admin/authors/pending', PublicationController.getPendingAuthors);
publication.put('/admin/authors/:id/verify', PublicationController.verifyAuthor);
publication.get('/admin/stats', PublicationController.getDashboardStats);

export { publication };
