import type { Card } from 'shared-types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


export const cardsApi = {
  async createCard(
    boardId: string,
    title: string,
    description: string,
    column: Card['column'],
  ): Promise<Card> {
    const res = await fetch(`${API_URL}/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ boardId, title, description, column }),
    });
    if (!res.ok) throw new Error('Failed to create card');
    return res.json();
  },

  async getCardsByBoard(boardId: string): Promise<Card[]> {
    const res = await fetch(`${API_URL}/cards?boardId=${boardId}`);
    if (!res.ok) throw new Error('Failed to fetch cards');
    return res.json();
  },

  async updateCard(
    id: string,
    data: { title?: string; description?: string },
  ): Promise<Card> {
    const res = await fetch(`${API_URL}/cards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update card');
    return res.json();
  },

  async moveCard(
    id: string,
    column: Card['column'],
    order: number,
  ): Promise<Card> {
    const res = await fetch(`${API_URL}/cards/${id}/move`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ column, order }),
    });
    if (!res.ok) throw new Error('Failed to move card');
    return res.json();
  },

  async deleteCard(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/cards/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete card');
  },
};