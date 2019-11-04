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
  });
  
  it('should create Participant in private collection speakers', async () => {
    adapter.stub.setCreator('blockchainMSP');
    const participant = new Participant({
      id: uuid(),
      name: 'ALICE',
      tracks: [{ 'name': 'blockchain', 'status': 'A' }]
    });

    const txid = await participantCtrl.$withUser('Test').registerAsSpeaker(participant);
    expect(txid).to.exist;

    const participantBlockchain = await participantCtrl.$withUser('Test').findSpeaker(participant.id);
    expect(new Participant(participantBlockchain).id).to.exist;
  });

});
