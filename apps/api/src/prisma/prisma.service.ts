import 'dotenv/config';

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';

/**
 * NestJSからPrisma Clientを利用するためのサービス。
 * PostgreSQLへの接続と切断をNestJSのライフサイクルに合わせて管理する。
 */

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString = process.env.DATABASE_URL;

    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined');
    }

    const adapter = new PrismaPg({ connectionString });
    super({ adapter });
  }

  /**
   * NestJS起動時にPostgreSQLへ接続する。
   */
  async onModuleInit() {
    await this.$connect();
  }

  /**
   * NestJS終了時にPostgreSQLとの接続を切断する。
   */
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
