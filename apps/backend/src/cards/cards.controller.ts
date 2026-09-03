import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { CardsService } from './cards.service.js';
import { CardColumn } from './entities/card.entity.js';

@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post()
  create(
    @Body('boardId') boardId: string,
    @Body('title') title: string,
    @Body('description') description: string,
    @Body('column') column: CardColumn,
  ) {
    return this.cardsService.create(boardId, title, description, column);
  }

  @Get()
  findAllByBoard(@Query('boardId') boardId: string) {
    return this.cardsService.findAllByBoard(boardId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body('title') title?: string,
    @Body('description') description?: string,
  ) {
    return this.cardsService.update(id, { title, description });
  }

  @Patch(':id/move')
  move(
    @Param('id') id: string,
    @Body('column') column: CardColumn,
    @Body('order') order: number,
  ) {
    return this.cardsService.move(id, column, order);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.cardsService.remove(id);
  }
}