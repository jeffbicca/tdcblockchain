import { Injectable } from '@nestjs/common';
import { Observable, empty } from 'rxjs';
import { chaincode, eventToListen, l } from '../env';
import { ConvectorControllers } from 'src/convector/controllers.interface';

@Injectable()
export class ListenerService {

    constructor(private cc: ConvectorControllers) {
        l('Initializing listener service!');
        this.cc.initAdapter.then(() => {
            if (!this.cc.hub) {
                return empty();
            }
            l('Listening to events...');

            Observable.create(observer => {
                this.cc.hub.registerChaincodeEvent(
                    chaincode,
                    eventToListen,
                    (event, blockNumber, txId, txStatus) => observer.next({
                        event,
                        blockNumber,
                        txId,
                        txStatus,
                    }),
                    (err) => observer.error(err),
                    { filtered: false } as any,
                );
            }).subscribe(this.resolve.bind(this));
        });
    }

    async resolve(event) {
        const newSpeaker =
            JSON.parse(event.event.payload.toString('utf8'));
        l('Got event!');
        l(newSpeaker);

        await this.cc.controller.__callback(newSpeaker);
        l('Marking speaker as verified!');
    }

}
