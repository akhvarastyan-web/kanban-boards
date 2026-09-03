import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CardEntity, CardColumn } from './entities/card.entity.js';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEntity)
    private readonly cardsRepository: Repository<CardEntity>,
  ) {}

  async create(
    boardId: string,
    title: string,
    description: string,
    column: CardColumn,
  ): Promise<CardEntity> {
    const count = await this.cardsRepository.count({
      where: { boardId, column },
    });

    const newCard = this.cardsRepository.create({
      id: randomUUID(),
      boardId,
      title,
      description,
      column,
      order: count,
    });

    return this.cardsRepository.save(newCard);
  }

  async findAllByBoard(boardId: string): Promise<CardEntity[]> {
    return this.cardsRepository.find({
      where: { boardId },
      order: { order: 'ASC' },
    });
  }

  async findOne(id: string): Promise<CardEntity> {
    const card = await this.cardsRepository.findOneBy({ id });
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return card;
  }

  async update(
    id: string,
    data: Partial<Pick<CardEntity, 'title' | 'description'>>,
  ): Promise<CardEntity> {
    const card = await this.findOne(id);
    Object.assign(card, data);
    return this.cardsRepository.save(card);
  }

  async move(
    id: string,
    targetColumn: CardColumn,
    targetOrder: number,
  ): Promise<CardEntity> {
    const card = await this.findOne(id);
    const sourceColumn = card.column;

    await this.cardsRepository
      .createQueryBuilder()
      .update(CardEntity)
      .set({ order: () => '"order" - 1' })
      .where('boardId = :boardId', { boardId: card.boardId })
      .andWhere('column = :sourceColumn', { sourceColumn })
      .andWhere('"order" > :oldOrder', { oldOrder: card.order })
      .execute();

    await this.cardsRepository
      .createQueryBuilder()
      .update(CardEntity)
      .set({ order: () => '"order" + 1' })
      .where('boardId = :boardId', { boardId: card.boardId })
      .andWhere('column = :targetColumn', { targetColumn })
      .andWhere('"order" >= :targetOrder', { targetOrder })
      .execute();

    card.column = targetColumn;
    card.order = targetOrder;
    return this.cardsRepository.save(card);
  }

  async remove(id: string): Promise<void> {
    const result = await this.cardsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
  }
}