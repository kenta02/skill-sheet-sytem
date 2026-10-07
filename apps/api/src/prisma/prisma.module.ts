import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';

@Module({
  providers: [PrismaService], // ModuleでPrismaServiceを使えるようにする
  exports: [PrismaService],// 他のModuleからもPrismaServiceを使えるようにする
})
export class PrismaModule {}