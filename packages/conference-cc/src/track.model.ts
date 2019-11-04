import * as yup from 'yup';
import {
  ConvectorModel,
  ReadOnly,
  Required,
  Validate
} from '@worldsibu/convector-core-model';

export class Track extends ConvectorModel<Track> {

  @ReadOnly()
  @Required()
  public readonly type = 'conference.Track';

  @Required()
  @Validate(yup.string())
  public name: string;

  @Required()
  @Validate(yup.string())
  public status: string;

}
