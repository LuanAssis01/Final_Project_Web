import { Attachment } from '../models/entities/attachment.js';

// Tipos de arquivo permitidos
const ALLOWED_FILE_TYPES = [
  'image', 'document', 'spreadsheet', 
  'presentation', 'video', 'audio', 'archive'
];

// Tamanho máximo em bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024; 

export const attachmentController = {
  async getAll(req, res) {
    try {
      const attachments = await Attachment.getAll();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(attachments));
    } catch (error) {
      console.error('Erro ao buscar anexos:', error);
      res.writeHead(500);
      res.end('Erro interno ao buscar anexos');
    }
  },

  async getById(req, res, id) {
    try {
      const attachment = await Attachment.findById(id);
      if (!attachment) {
        res.writeHead(404);
        return res.end('Anexo não encontrado');
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(attachment));
    } catch (error) {
      console.error('Erro ao buscar anexo:', error);
      res.writeHead(500);
      res.end('Erro interno ao buscar anexo');
    }
  },

  async create(req, res) {
    let body = '';
    req.on('data', chunk => body += chunk);
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        
        // Validação básica
        if (!data.projectId || !data.filename || !data.url) {
          res.writeHead(400);
          return res.end('projectId, filename e url são obrigatórios');
        }

        // Valida tipo de arquivo
        if (data.fileType && !ALLOWED_FILE_TYPES.includes(data.fileType)) {
          res.writeHead(400);
          return res.end(`Tipo de arquivo inválido. Permitidos: ${ALLOWED_FILE_TYPES.join(', ')}`);
        }

        // Valida tamanho do arquivo
        if (data.size && data.size > MAX_FILE_SIZE) {
          res.writeHead(413);
          return res.end(`Tamanho máximo permitido: ${MAX_FILE_SIZE/1024/1024}MB`);
        }

        const newAttachment = await Attachment.create(data);
        res.writeHead(201, { 
          'Content-Type': 'application/json',
          'Location': `/attachments/${newAttachment.id}` 
        });
        res.end(JSON.stringify(newAttachment));
      } catch (error) {
        if (error instanceof SyntaxError) {
          res.writeHead(400);
          res.end('JSON inválido');
        } else {
          console.error('Erro ao criar anexo:', error);
          res.writeHead(500);
          res.end('Erro interno ao criar anexo');
        }
      }
    });
  },

  async update(req, res, id) {
    let body = '';
    req.on('data', chunk => body += chunk);
    
    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        
        // Não permite alterar o ID
        if (data.id && data.id !== id) {
          res.writeHead(400);
          return res.end('ID do anexo não pode ser alterado');
        }

        const updatedAttachment = await Attachment.update(id, data);
        if (!updatedAttachment) {
          res.writeHead(404);
          return res.end('Anexo não encontrado');
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(updatedAttachment));
      } catch (error) {
        console.error('Erro ao atualizar anexo:', error);
        res.writeHead(500);
        res.end('Erro interno ao atualizar anexo');
      }
    });
  },

  async delete(req, res, id) {
    try {
      const success = await Attachment.delete(id);
      if (!success) {
        res.writeHead(404);
        return res.end('Anexo não encontrado');
      }
      res.writeHead(204);
      res.end();
    } catch (error) {
      console.error('Erro ao excluir anexo:', error);
      res.writeHead(500);
      res.end('Erro interno ao excluir anexo');
    }
  },

  async getByProjectId(req, res, projectId) {
    try {
      const attachments = await Attachment.findByProjectId(projectId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(attachments));
    } catch (error) {
      console.error('Erro ao buscar anexos do projeto:', error);
      res.writeHead(500);
      res.end('Erro interno ao buscar anexos do projeto');
    }
  },

  async getSummary(req, res, projectId) {
    try {
      const summary = await Attachment.getProjectAttachmentsSummary(projectId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(summary));
    } catch (error) {
      console.error('Erro ao gerar resumo de anexos:', error);
      res.writeHead(500);
      res.end('Erro interno ao gerar resumo de anexos');
    }
  }
};