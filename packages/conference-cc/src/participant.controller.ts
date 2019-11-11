import * as yup from 'yup';

import { ChaincodeTx } from '@worldsibu/convector-platform-fabric';
import {
  Controller,
  ConvectorController,
  Invokable,
  Param
} from '@worldsibu/convector-core';
import { Participant } from './participant.model';
import { Transform } from '@theledger/fabric-chaincode-utils';

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
  public async registerAsSpeaker(
    @Param(Participant) 
    participant: Participant
  ) {
    await participant.save({ privateCollection : this.track });
    this.tx.stub.setEvent('newSpeaker', participant);
    
    return { txID: this.tx.stub.getStub().getTxID() };
  }

  @Invokable()
  public async findSpeaker(
    @Param(yup.string())
    id: string
  ) {
    return await Participant.getOne(id, Participant, { privateCollection: this.track });
  }

  @Invokable()
  public async findSpeakers() {
    let queryString = { selector: { '_id': { '$gt': null } }};
    let speakers = await this.tx.stub.getStub().getPrivateDataQueryResult(this.track, JSON.stringify(queryString))
    speakers = (<any> speakers).iterator ? (<any> speakers).iterator : speakers; // hack for fabric 1.4

    return await Transform.iteratorToList(speakers);
  }

  @Invokable()
  public async __callback(
    @Param(Participant) 
    participant: Participant
  ) {
    participant.verified = true;

    await participant.save({ privateCollection : this.track });

    return { txID: this.tx.stub.getStub().getTxID() };
  }

  private get track() {
    const mspid = this.tx.identity.getMSPID();

    return mspid.toLowerCase().split("msp")[0];
  }
 
}
