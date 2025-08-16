import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AiController } from './ai.controller';
import { DoubaoService } from './doubao.service';
import { KimiService } from './kimi.service';

@Module({
  imports: [ConfigModule],
  controllers: [AiController],
  providers: [DoubaoService, KimiService],
  exports: [DoubaoService, KimiService],
})
export class AiModule {}