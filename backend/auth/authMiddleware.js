import { User } from '../models/entities/user.js';

const tokenMap = {
  'admin-123': 'Admin',
  'prof-456': 'Professor',
  'memb-789': 'CommunityMember',
  'vis-000': 'Visitor'
};

export function authMiddleware(req, res, allowedRoles = []) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    res.writeHead(401);
    return res.end('Token não fornecido');
  }

  const token = authHeader.replace('Bearer ', '');
  const role = tokenMap[token];

  if (!role) {
    res.writeHead(403);
    return res.end('Token inválido');
  }

  if (!allowedRoles.includes(role)) {
    res.writeHead(403);
    return res.end('Permissão negada');
  }

  req.user = { role, token };

  return true;
}
