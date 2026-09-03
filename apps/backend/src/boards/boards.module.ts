import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsService } from './boards.service.js';
import { BoardsController } from './boards.controller.js';
import { BoardEntity } from './entities/board.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([BoardEntity])],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}