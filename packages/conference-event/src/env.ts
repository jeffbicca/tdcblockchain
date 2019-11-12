import * as dotenv from 'dotenv';
dotenv.config();
import * as os from 'os';
const homedir = os.homedir();

export const l = console.log;

export const chaincode = process.env.CHAINCODE || 'conference';
export const channel = process.env.CHANNEL || 'chconf';
export const eventToListen = process.env.EVENT || 'newSpeaker';

export const organization = process.env.ORG || 'blockchain';
export const user = process.env.IDENTITY || 'client';

export const keyStore = process.env.KEYSTORE || `/${homedir}/hyperledger-fabric-network/.hfc-${organization}`;
export const networkProfile = process.env.NETWORKPROFILE ||
    `/${homedir}/hyperledger-fabric-network/network-profiles/${organization}.network-profile.yaml`;
