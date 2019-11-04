import * as yup from 'yup';

import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';
import { Participant } from './participant.model';

@Controller('participant')
export class ParticipantController extends ConvectorController<ChaincodeTx> {

  @Invokable()
  public async register(
    @Param(Participant)
    participant: Participant
  ) {
    await participant.save();

    return { txID: this.tx.stub.getStub().getTxID() };
  }

  @Invokable()
  public async find(
    @Param(yup.string())
    id: string
  ) {
    return await Participant.getOne(id);
  }

  @Invokable()
  public async history(
    @Param(yup.string())
    id: string
  ) {
    const participant = await Participant.getOne(id);

    return await participant.history();
  }

  @Invokable()
  public async registerAsSpeaker(@Param(Participant) participant: Participant) {
    await participant.save({ privateCollection : this.track });
 
    return { txID: this.tx.stub.getStub().getTxID() };
  }

  @Invokable()
  public async findSpeaker(
    @Param(yup.string())
    id: string
  ) {
    return await Participant.getOne(id, Participant, { privateCollection: this.track });
  }

  private get track() {
    const mspid = this.tx.identity.getMSPID();

    return mspid.toLowerCase().split("msp")[0];
  }
 
}
