import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { BoardsService } from './boards.service.js';
import { Board } from 'shared-types';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  create(@Body('name') name: string): Promise<Board> {
    return this.boardsService.create(name);
  }

  @Get()
  findAll(): Promise<Board[]> {
    return this.boardsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Board> {
    return this.boardsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body('name') name: string): Promise<Board> {
    return this.boardsService.update(id, name);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.boardsService.remove(id);
  }
}