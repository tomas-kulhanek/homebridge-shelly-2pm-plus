export class AccessoryStatusResult {
  id = 0;
  source = '';
  output = false;
  apower = 0.0;
  voltage = 236.2;
  current = 0;
  pf = 0;

  constructor(props: AccessoryStatusResult | null = null) {
    Object.assign(this, props);
  }

}