import { Module } from '@nestjs/common';
import { ListenerService } from './listener.service';
import { ControllerModule } from '../convector/controllers.module';

@Module({
  imports: [
    ControllerModule,
  ],
  controllers: [
  ],
  providers: [
    ListenerService,
  ],
})
export class ListenerModule {}
