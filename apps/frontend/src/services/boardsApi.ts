const API_URL = 'http://localhost:3000';

import type { Board } from 'shared-types';



export const boardsApi = {
async createBoard(name: string): Promise<Board> {
    const res = await fetch(`${API_URL}/boards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to create board');
    return res.json();
  },

  async getAllBoards(): Promise<Board[]> {
    const res = await fetch(`${API_URL}/boards`);
    if (!res.ok) throw new Error('Failed to fetch boards');
    return res.json();
  },

  async getBoard(id: string): Promise<Board> {
    const res = await fetch(`${API_URL}/boards/${id}`);
    if (!res.ok) throw new Error('Board not found');
    return res.json();
  },

  async updateBoard(id: string, name: string): Promise<Board> {
    const res = await fetch(`${API_URL}/boards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to update board');
    return res.json();
  },

  async deleteBoard(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/boards/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete board');
  },
};