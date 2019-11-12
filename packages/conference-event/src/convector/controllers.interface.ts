import { Injectable } from '@nestjs/common';
import { ChannelEventHub } from 'fabric-client';
import { ConvectorControllerClient, ControllerAdapter } from '@worldsibu/convector-core';
import { ParticipantController } from '../../node_modules/conference-cc';
@Injectable()
export abstract class ConvectorControllers {
  hub?: ChannelEventHub;
  abstract initAdapter: Promise<void>;
  abstract adapter: ControllerAdapter;

  abstract controller: ConvectorControllerClient<ParticipantController>;
}
