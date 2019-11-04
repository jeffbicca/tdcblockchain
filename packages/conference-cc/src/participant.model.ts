import * as yup from 'yup';
import {
  ConvectorModel,
  ReadOnly,
  Required,
  Validate,
  FlatConvectorModel
} from '@worldsibu/convector-core-model';

import { Track } from './track.model';

export class Participant extends ConvectorModel<Participant> {

  @ReadOnly()
  @Required()
  public readonly type = 'conference.Participant';

  @Required()
  @Validate(yup.string())
  public id: string;

  @Required()
  @Validate(yup.string())
  public name: string;

  @Required()
  @Validate(yup.array(Track.schema()))
  public tracks: Array<FlatConvectorModel<Track>>;

}
