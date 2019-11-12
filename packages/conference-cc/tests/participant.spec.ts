// tslint:disable:no-unused-expression
import { join } from 'path';
import { expect } from 'chai';
import * as uuid from 'uuid/v4';
import { MockControllerAdapter } from '@worldsibu/convector-adapter-mock';
import { ClientFactory, ConvectorControllerClient } from '@worldsibu/convector-core';
import 'mocha';

import { Participant, ParticipantController } from '../src';

describe('Conferences', () => {
  let adapter: MockControllerAdapter;
  let participantCtrl: ConvectorControllerClient<ParticipantController>;
  
  before(async () => {
    // Mocks the blockchain execution environment
    adapter = new MockControllerAdapter();
    participantCtrl = ClientFactory(ParticipantController, adapter);

    await adapter.init([
      {
        version: '*',
        controller: 'ParticipantController',
        name: join(__dirname, '..')
      }
    ]);

    adapter.addUser('Test');

    participantCtrl = participantCtrl.$withUser('Test');
  });
  
  it('should create and find Participant in private collection speakers', async () => {
    adapter.stub.setCreator('blockchainMSP');
    const participant = new Participant({
      id: uuid(),
      name: 'ALICE',
      tracks: [{ 'name': 'blockchain', 'status': 'A' }]
    });

    const txid = await participantCtrl.registerAsSpeaker(participant);
    expect(txid).to.exist;

    const participantBlockchain = await participantCtrl.findSpeaker(participant.id);
    expect(new Participant(participantBlockchain).id).to.exist;
  });

  it('should create and find Participant in conference', async () => {
    const participant = new Participant({
      id: uuid(),
      name: 'BOB',
      tracks: [{ 'name': 'stadium', 'status': 'A' }]
    });

    const txid = await participantCtrl.register(participant);
    expect(txid).to.exist;

    const participantBlockchain = await participantCtrl.find(participant.id);
    expect(new Participant(participantBlockchain).id).to.exist;
  });

  it('should create, find, update and return history of Participant in conference', async () => {
    const participant = new Participant({
      id: uuid(),
      name: 'CAROL',
      tracks: [{ 'name': 'microservices', 'status': 'A' }]
    });

    const txid = await participantCtrl.register(participant);
    expect(txid).to.exist;

    const participantBlockchain = await participantCtrl.find(participant.id);
    expect(new Participant(participantBlockchain).id).to.exist;
    
    participantBlockchain.verified = true;
    const txid2 = await participantCtrl.register(participantBlockchain);
    expect(txid2).to.exist;

    const verifiedParticipantBlockchain = await participantCtrl.find(participant.id);
    expect(new Participant(verifiedParticipantBlockchain).verified).to.be.true;
    
    const history = await participantCtrl.history(participant.id);
    expect(history).to.not.be.empty;
    expect(history).to.be.lengthOf(2);
    
    const participantBeforeVerified: Participant = new Participant(history[0].value);
    expect(participantBeforeVerified.verified).to.be.undefined;

    const participantAfterVerified: Participant = new Participant(history[1].value);
    expect(participantAfterVerified.verified).to.be.true;
  });

  it('should update Participant verified flag in callback', async () => {
    adapter.stub.setCreator('blockchainMSP');
    const participant = new Participant({
      id: uuid(),
      name: 'ALICE',
      tracks: [{ 'name': 'blockchain', 'status': 'A' }]
    });

    const txid = await participantCtrl.registerAsSpeaker(participant);
    expect(txid).to.exist;

    const participantBlockchain = await participantCtrl.findSpeaker(participant.id);
    expect(new Participant(participantBlockchain).id).to.exist;

    const txid2 = await participantCtrl.__callback(participantBlockchain);
    expect(txid2).to.exist;

    const participantVerified = await participantCtrl.findSpeaker(participant.id);
    expect(new Participant(participantVerified).verified).to.be.true;
  });

});
