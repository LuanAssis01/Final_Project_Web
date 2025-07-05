// router/index.js
import { userRouter } from './userRouter.js';
import { projectRouter } from './projectRouter.js';
import { profileRouter } from './profileRouter.js';
import { commentRouter } from './commentRouter.js';
import { participationRequestRouter } from './participationRequestRouter.js';
import { impactMetricRouter } from './impactMetricRouter.js';
import { attachmentRouter } from './attachmentRouter.js';
import { notificationRouter } from './notificationRouter.js';

export function mainRouter(req, res) {
  if (req.url.startsWith('/api/users')) return userRouter(req, res);
  if (req.url.startsWith('/api/projects')) return projectRouter(req, res);
  if (req.url.startsWith('/api/profiles')) return profileRouter(req, res);
  if (req.url.startsWith('/api/comments')) return commentRouter(req, res);
  if (req.url.startsWith('/api/requests')) return participationRequestRouter(req, res);
  if (req.url.startsWith('/api/metrics')) return impactMetricRouter(req, res);
  if (req.url.startsWith('/api/attachments')) return attachmentRouter(req, res);
  if (req.url.startsWith('/api/notifications')) return notificationRouter(req, res);
  if (req.url.startsWith('/api/filter')) return filterRouter(req, res);

  res.writeHead(404);
  res.end('Rota não encontrada');
}
