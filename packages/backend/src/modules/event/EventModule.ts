import { Module } from '@nestjs/common';

import { UserModule } from '../user';

import { EventService } from './services/EventService';
import { EventController } from './controllers/EventController';

@Module({
  imports: [UserModule],
  providers: [EventService],
  controllers: [EventController],
})
export class EventModule {}
