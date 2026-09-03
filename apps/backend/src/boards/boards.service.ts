import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from 'shared-types';
import { randomUUID } from 'crypto';
import { BoardEntity } from './entities/board.entity.js';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardEntity)
    private readonly boardsRepository: Repository<BoardEntity>,
  ) {}

  async create(name: string): Promise<Board> {
    const newBoard = this.boardsRepository.create({
      id: randomUUID(),
      name,
      columns: {
        todo: [],
        inProgress: [],
        done: [],
      },
    });
    return this.boardsRepository.save(newBoard);
  }

  async findAll(): Promise<Board[]> {
    return this.boardsRepository.find();
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.boardsRepository.findOneBy({ id });
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    return board;
  }

  async update(id: string, name: string): Promise<Board> {
    const board = await this.findOne(id);
    board.name = name;
    return this.boardsRepository.save(board);
  }

  async remove(id: string): Promise<void> {
    const result = await this.boardsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
  }
}