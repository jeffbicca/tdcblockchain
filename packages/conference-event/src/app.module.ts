import { Module } from '@nestjs/common';
import { ListenerModule } from './listener/listener.module';

@Module({
  imports: [
    ListenerModule,
  ],
})
export class AppModule { }
