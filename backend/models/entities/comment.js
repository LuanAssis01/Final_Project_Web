import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import { randomUUID } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_PATH = join(__dirname, '../../data/comments.json');

const ensureFileExists = async () => {
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, '[]', 'utf-8');
  }
};

await ensureFileExists();

export class Comment {
  constructor(projectId, userId, text, createdAt = new Date().toISOString()) {
    this.id = randomUUID();
    this.projectId = projectId;
    this.userId = userId;
    this.text = text;
    this.createdAt = createdAt;
    this.updatedAt = null;
    this.replies = []; // For nested comments/replies
    this.likes = []; // Array of user IDs who liked the comment
    this.isEdited = false;
  }

  static async getAll() {
    try {
      const data = await fs.readFile(DATA_PATH, 'utf-8');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error reading comments:', err);
      return [];
    }
  }

  static async saveAll(comments) {
    try {
      await fs.writeFile(DATA_PATH, JSON.stringify(comments, null, 2));
    } catch (err) {
      console.error('Error saving comments:', err);
      throw err;
    }
  }

  static async findById(id) {
    const comments = await this.getAll();
    return comments.find(c => c.id === id);
  }

  static async findByProjectId(projectId) {
    const comments = await this.getAll();
    return comments.filter(c => c.projectId === projectId);
  }

  static async findByUserId(userId) {
    const comments = await this.getAll();
    return comments.filter(c => c.userId === userId);
  }

  static async create(data) {
    const comments = await this.getAll();
    const comment = new Comment(
      data.projectId,
      data.userId,
      data.text,
      data.createdAt
    );
    comments.push(comment);
    await this.saveAll(comments);
    return comment;
  }

  static async update(id, updatedData) {
    const comments = await this.getAll();
    const index = comments.findIndex(c => c.id === id);
    
    if (index === -1) return null;
    
    const updatedComment = {
      ...comments[index],
      ...updatedData,
      updatedAt: new Date().toISOString(),
      isEdited: true,
      id: comments[index].id 
    };
    
    comments[index] = updatedComment;
    await this.saveAll(comments);
    return updatedComment;
  }

  static async delete(id) {
    const comments = await this.getAll();
    const originalLength = comments.length;
    const filteredComments = comments.filter(c => c.id !== id);
    
    if (filteredComments.length === originalLength) {
      return false;
    }
    
    await this.saveAll(filteredComments);
    return true;
  }

  static async addReply(commentId, replyData) {
    const comments = await this.getAll();
    const index = comments.findIndex(c => c.id === commentId);
    
    if (index === -1) return null;
    
    const reply = new Comment(
      comments[index].projectId,
      replyData.userId,
      replyData.text
    );
    
    comments[index].replies.push(reply);
    comments[index].updatedAt = new Date().toISOString();
    await this.saveAll(comments);
    return reply;
  }

  static async toggleLike(commentId, userId) {
    const comments = await this.getAll();
    const index = comments.findIndex(c => c.id === commentId);
    
    if (index === -1) return null;
    
    const likeIndex = comments[index].likes.indexOf(userId);
    if (likeIndex === -1) {
      comments[index].likes.push(userId); // Add like
    } else {
      comments[index].likes.splice(likeIndex, 1); // Remove like
    }
    
    await this.saveAll(comments);
    return comments[index];
  }

  static async getCommentCount(projectId) {
    const comments = await this.findByProjectId(projectId);
    return comments.length;
  }
}