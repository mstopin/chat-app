import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { HashingModule } from './common/modules/HashingModule';

import { UserModule } from './modules/user';
import { AuthModule } from './modules/auth';
import { ChannelModule } from './modules/channel';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return <TypeOrmModuleOptions>{
          type: 'postgres' as const,
          host: configService.getOrThrow<string>('DB_HOST'),
          port: configService.getOrThrow<number>('DB_PORT'),
          username: configService.getOrThrow<string>('DB_USER'),
          password: configService.getOrThrow<string>('DB_PASS'),
          database: configService.getOrThrow<string>('DB_NAME'),
          entities: [`${__dirname}/**/entities/*.{js,ts}`],
          migrations: [`${__dirname}/database/migrations/*.{js,ts}`],
        };
      },
    }),
    HashingModule,
    UserModule,
    AuthModule,
    ChannelModule,
  ],
})
export class AppModule {}
