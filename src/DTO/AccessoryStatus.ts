import {AccessoryStatusResult} from './AccessoryStatusResult';

export class AccessoryStatus {
  id = 0;
  src = '';
  result: AccessoryStatusResult | undefined;

  constructor(props: AccessoryStatus | null = null) {
    Object.assign(this, props);
    if (props?.result) {
      props.result = new AccessoryStatusResult(props.result);
    }
  }
}