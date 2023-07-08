import {AccessoryResult} from './AccessoryResult';

export class Accessory {
  id = 0;
  src = '';
  result: AccessoryResult | undefined;

  constructor(props: Accessory | null = null) {
    Object.assign(this, props);
    if (props?.result) {
      props.result = new AccessoryResult(props.result);
    }
  }
}