import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CardsService } from './cards.service.js';
import { CardsController } from './cards.controller.js';
import { CardEntity } from './entities/card.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([CardEntity])],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}