// router/index.js
import { userRouter } from './userRouter.js';
import { profileRouter } from './profileRouter.js';
import { projectRouter } from './projectRouter.js';
import { impactMetricRouter } from './impactMetricRouter.js';
import { attachmentRouter } from './attachmentRouter.js';
import { commentRouter } from './commentRouter.js';
import { participationRequestRouter } from './participationRequestRouter.js';
import { notificationRouter } from './notificationRouter.js';
import { filterRouter } from './filterRouter.js';
import { authMiddleware } from '../auth/authMiddleware.js';

export function mainRouter(req, res) {
  if (req.url.startsWith('/api/users')) return userRouter(req, res);
  if (req.url.startsWith('/api/profiles')) return profileRouter(req, res);

  if (req.url.startsWith('/api/projects')) {
    if (['POST', 'PUT'].includes(req.method)) {
      if (!authMiddleware(req, res, ['Admin', 'Professor'])) return;
    }
    if (req.method === 'DELETE') {
      if (!authMiddleware(req, res, ['Admin'])) return;
    }
    return projectRouter(req, res);
  }

  if (req.url.startsWith('/api/metrics')) {
    if (['POST', 'PUT'].includes(req.method)) {
      if (!authMiddleware(req, res, ['Admin', 'Professor'])) return;
    }
    if (req.method === 'DELETE') {
      if (!authMiddleware(req, res, ['Admin'])) return;
    }
    return impactMetricRouter(req, res);
  }

  if (req.url.startsWith('/api/attachments')) {
    if (req.method === 'POST') {
      if (!authMiddleware(req, res, ['Admin', 'Professor'])) return;
    }
    if (req.method === 'DELETE') {
      if (!authMiddleware(req, res, ['Admin'])) return;
    }
    return attachmentRouter(req, res);
  }

  if (req.url.startsWith('/api/comments')) {
    if (req.method === 'POST') {
      if (!authMiddleware(req, res, ['Admin', 'Professor', 'CommunityMember'])) return;
    }
    if (req.method === 'DELETE') {
      if (!authMiddleware(req, res, ['Admin', 'Professor', 'CommunityMember'])) return;
    }
    return commentRouter(req, res);
  }

  if (req.url.startsWith('/api/requests')) {
    if (['POST', 'PUT'].includes(req.method)) {
      if (!authMiddleware(req, res, ['Admin', 'Professor', 'CommunityMember'])) return;
    }
    if (req.method === 'DELETE') {
      if (!authMiddleware(req, res, ['Admin'])) return;
    }
    return participationRequestRouter(req, res);
  }

  if (req.url.startsWith('/api/notifications')) {
    if (!authMiddleware(req, res, ['Admin', 'Professor', 'CommunityMember'])) return;
    return notificationRouter(req, res);
  }

  if (req.url.startsWith('/api/filter')) return filterRouter(req, res);

  res.writeHead(404);
  res.end('Rota não encontrada');
}
